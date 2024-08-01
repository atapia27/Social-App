# backend/users/user_routers.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth.utils import create_access_token
from backend.dependencies import get_db
from backend import crud, schemas
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.retrieve_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return db_user

@router.get("/users/by-username/{username}")
async def get_user_by_username(username: str, db: Session = Depends(get_db)):
    db_user = crud.retrieve_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "username": db_user.username,
        "icon": db_user.icon,
    }

@router.get("/users/by-email/{email}")
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = crud.retrieve_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "username": db_user.username,
        "icon": db_user.icon,
    }
