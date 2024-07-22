# backend\crud.py
from sqlalchemy.orm import Session
from backend import models, schemas


def create_user(db: Session, user: schemas.User):
    db_user = models.User(
        email=user.email, username=user.username, icon=user.icon, token=None
    )  # Initialize token as None
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_token(db: Session, user_id: int, token: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.token = token # Update the token
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def retrieve_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def retrieve_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def retrieve_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()
