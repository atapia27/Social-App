# backend/users/user_routers.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth.utils import create_access_token
from backend.dependencies import get_db
from backend import crud, schemas
from fastapi.responses import JSONResponse


router = APIRouter()


@router.post("/users/")
async def post_user(user: schemas.User, db: Session = Depends(get_db)):
    db_user = crud.retrieve_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    new_user = crud.create_user(db=db, user=user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    db_user = crud.update_user_token(
        db=db, user_id=new_user.id, token=access_token
    )  # Update the db_user with the access token

    response = JSONResponse(
        content={
            "access_token": access_token,
            "token_type": "bearer",
            "username": new_user.username,
            "icon": new_user.icon,
        }
    )
    return response


@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.retrieve_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return db_user


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
        "username": db_user.username,
        "icon": db_user.icon,
    }
