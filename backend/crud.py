# backend\crud.py
from sqlalchemy.orm import Session
from . import models, schemas


def create_user(db: Session, user: schemas.User):
    db_user = models.User(
        email=user.email, username=user.username, icon=user.icon, token=None
    )  # Initialize token as None
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()
