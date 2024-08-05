# backend/crud.py

from sqlalchemy.orm import Session
from backend import models, schemas

def create_user(db: Session, user: schemas.CreateUser):
    base_user_id = f"{user.first_name.lower()}_{user.last_name.lower()}"
    user_id = base_user_id
    count = 1

    # Ensure user_id is unique
    while db.query(models.User).filter(models.User.id == user_id).first():
        user_id = f"{base_user_id}{count}"
        count += 1

    db_user = models.User(
        id=user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        icon=user.icon,
        logged_in=True # New users are logged in by default
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def retrieve_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def retrieve_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()
