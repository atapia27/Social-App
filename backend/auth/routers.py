# backend\auth\routers.py
from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from auth.utils import create_access_token, verify_token
from dependencies import get_db
from backend import crud, schemas
from backend.schemas import LoginRequest

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/login")
async def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=request.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.token:
        try:
            payload = jwt.decode(db_user.token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload:
                raise HTTPException(status_code=400, detail="User already logged in")
        except JWTError:
            pass

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)
    
    db_user.token = access_token
    db.commit()

    response = JSONResponse(content={
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username,
        "icon": db_user.icon
    })

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Lax"
    )

    return response

@router.post("/logout")
async def logout_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        db_user = crud.get_user_by_email(db, email=email)
        if db_user:
            db_user.token = None
            db.commit()
        response = JSONResponse(content={"message": "Successfully logged out"})
        response.delete_cookie(key="access_token")
        return response
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/token")
async def read_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        db_user = crud.get_user_by_email(db, email=email)
        if db_user is None or db_user.token != token:  # Ensure the token is valid
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return {"email": db_user.email, "username": db_user.username, "icon": db_user.icon}
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
