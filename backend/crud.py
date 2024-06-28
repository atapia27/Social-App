from sqlalchemy.orm import Session

from . import models, schemas

def create_user(db: Session, user: schemas.User):
    db_user = models.User(email=user.email, username=user.username, icon=user.icon)
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

def create_video(db: Session, video: schemas.Video):
    db_video = models.Video(user_id=video.user_id, description=video.description, video_url=video.video_url, title=video.title)
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def get_video(db: Session, video_id: str):
    return db.query(models.Video).filter(models.Video.id == video_id).first()
    
def get_videos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Video).offset(skip).limit(limit).all()

def create_comment(db: Session, comment: schemas.Comment):
    db_comment = models.Comment(video_id=comment.video_id, content=comment.content, user_id=comment.user_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comment(db: Session, comment_id: str):
    return db.query(models.Comment).filter(models.Comment.id == comment_id).first()

def get_comments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Comment).offset(skip).limit(limit).all()

def get_comments_by_video_id(db: Session, video_id: str):
    return db.query(models.Comment).filter(models.Comment.video_id == video_id).all()

def get_comments_by_user_id(db: Session, user_id: str):
    return db.query(models.Comment).filter(models.Comment.user_id == user_id).all()

