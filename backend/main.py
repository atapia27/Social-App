# backend\main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer  # New import
from fastapi import Depends, Request, FastAPI, HTTPException, Security, status  # Ensure this import is present
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.schemas import LoginRequest  # Ensure this import is present
from database import SessionLocal
from datetime import datetime, timedelta # Ensure this import is present
from jose import JWTError, jwt  # Ensure this import is present


SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CORS middleware to allow requests from your Next.js frontend
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme for authentication
# This will be used in the route to get the current user, and in the route to get the token from the frontend to verify it
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get the current user from the token
async def verify_token(request: Request, token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    request.state.user = token_data

# Dependency to get the current user from the token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get the current user from the token
async def get_current_user(token: str = Security(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    return token_data

##################################################################################
##################################### TOKENS #####################################
##################################################################################

""" Updated the /token endpoint to verify if a user is logged in and return the appropriate response. """
############### GET TOKEN ################
@app.get("/token")
async def read_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        db_user = crud.get_user_by_email(db, email=email)
        if db_user is None or db_user.token != token:  # Ensure the token is valid
            raise HTTPException(status_code=404, detail="User not found")
        return {"email": db_user.email, "username": db_user.username, "icon": db_user.icon}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

#################################################################################
##################################### AUTH #####################################
#################################################################################

""" Modified the login_user endpoint to check if a user is already logged in by verifying if a token exists for the user. """
############### LOGIN USER ################
@app.post("/login")
async def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=request.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is already logged in by verifying if they have a valid token
    if db_user.token:  # Only attempt to decode if the token is not None
        try:
            payload = jwt.decode(db_user.token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload:
                raise HTTPException(status_code=400, detail="User already logged in")
        except JWTError:
            # If token is invalid or expired, allow login process to continue
            pass

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)
    
    db_user.token = access_token  # Save the new token
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username,
        "icon": db_user.icon
    }

""" Added a /logout endpoint to invalidate the user's token by setting it to None in the database."""
############### LOGOUT USER ################
@app.post("/logout")
async def logout_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        db_user = crud.get_user_by_email(db, email=email)
        if db_user:
            db_user.token = None  # Invalidate the token
            db.commit()
        return {"message": "Successfully logged out"}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

#################################################################################
##################################### USERS #####################################
#################################################################################

############### CREATE USER ################
@app.post("/users/")
async def create_user(user: schemas.User, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db=db, user=user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": new_user.username,
        "icon": new_user.icon
    }

############### GET USER ################
@app.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

############### GET USER BY EMAIL ################
@app.get("/users/by-email/{email}")
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username,
        "icon": db_user.icon
    }
