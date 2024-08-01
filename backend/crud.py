# backend\crud.py
from sqlalchemy.orm import Session
from backend import models, schemas


def create_user(db: Session, user: schemas.User):

    # __tablename__ = "User"
    # id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    # first_name = Column(String)
    # last_name = Column(String)
    # username = Column(String)
    # icon = Column(String)
    # token = Column(String, nullable=True)  # Token attribute added

    # username is first_name + "_" last_name BUT if it already exists, add a number at the end
    # e.g. if first_name = "John" and last_name = "Doe" and username "john_doe" already exists, the username should be "john_doe1"  
    # should be converted to lowercase ALWAYS, e.g. "John_Doe" -> "john_doe"  
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
