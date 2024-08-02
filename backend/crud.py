# backend/crud.py

from sqlalchemy.orm import Session
from backend import models, schemas

def create_user(db: Session, user: schemas.User):
    username = f"{user.first_name}_{user.last_name}".lower()
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if db_user:
        count = 1
        while db.query(models.User).filter(models.User.username == f"{username}{count}").first():
            count += 1
        username = f"{username}{count}"

    db_user = models.User(
        email=user.email, first_name=user.first_name, last_name=user.last_name, username=username, icon=user.icon, token=None
    )  # Initialize token as None

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_token(db: Session, user_id: str, token: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.token = token  # Update the token
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def retrieve_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def retrieve_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def retrieve_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def retrieve_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()
