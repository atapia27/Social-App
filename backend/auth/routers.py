# backend/auth/routers.py

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import timedelta
from backend.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth.utils import create_access_token
from backend.dependencies import get_db
from backend import crud, schemas

router = APIRouter()
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/login")
async def login_user(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    logger.info("Attempting to log in user with email: %s", request.email)
    db_user = crud.retrieve_user_by_email(db, email=request.email)
    if not db_user:
        logger.warning("User not found: %s", request.email)
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.token:
        try:
            jwt.decode(db_user.token, SECRET_KEY, algorithms=[ALGORITHM])
            logger.warning("User already logged in: %s", request.email)
            raise HTTPException(status_code=400, detail="User already logged in")
        except JWTError:
            pass

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )

    db_user.token = access_token
    db.commit()
    logger.info("User logged in successfully: %s", request.email)

    response = JSONResponse(
        content={
            "access_token": access_token,
            "token_type": "bearer",
            "username": db_user.username,
            "icon": db_user.icon,
        }
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Lax",
    )

    return response


@router.post("/logout")
async def logout_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        db_user = crud.retrieve_user_by_email(db, email=email)
        if db_user:
            # This check ensures that the token provided is the one currently associated with the user.
            # If the token matches, proceed to invalidate it.
            if db_user.token == token:
                db_user.token = None
                db.commit()
                logger.info("Token invalidated for user: %s", email)
                response = JSONResponse(content={"message": "Successfully logged out"})
                response.delete_cookie(key="access_token")
                return response
            else:
                logger.warning("Attempt to logout with an invalid or already invalidated token for user: %s", email)
                response = JSONResponse(content={"message": "Token already expired or invalid"}, status_code=status.HTTP_401_UNAUTHORIZED)
                response.delete_cookie(key="access_token")
                return response
        else:
            logger.warning("User not found for email: %s", email)
            return JSONResponse(content={"message": "User not found"}, status_code=status.HTTP_404_NOT_FOUND)
    except JWTError as e:
        logger.warning("JWTError during logout: %s", e)
        response = JSONResponse(content={"message": "Token already expired or invalid"}, status_code=status.HTTP_401_UNAUTHORIZED)
        response.delete_cookie(key="access_token")
        return response
    except Exception as e:
        logger.error("Exception during logout: %s", e)
        response = JSONResponse(content={"message": "Logout failed due to server error"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return response

@router.get("/token")
async def read_token(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            logger.warning("Invalid token: no email found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        db_user = crud.retrieve_user_by_email(db, email=email)
        if db_user is None or db_user.token != token:
            logger.warning("User not found or token mismatch: %s", email)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        logger.info("Token read successfully for user: %s", email)
        return {
            "email": db_user.email,
            "username": db_user.username,
            "icon": db_user.icon,
        }
    except JWTError as e:
        logger.warning("Invalid token: %s", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
