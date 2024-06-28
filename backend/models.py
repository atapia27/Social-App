from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    description = Column(String)
    video_url = Column(String)
    title = Column(String)

    comments = relationship("Comment", back_populates="video")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True)
    video_id = Column(String, ForeignKey("videos.id"))
    content = Column(String)
    user_id = Column(String)

    video = relationship("Video", back_populates="comments")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    icon = Column(String)