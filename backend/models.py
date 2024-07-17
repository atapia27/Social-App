# backend\models.py
from sqlalchemy import (
    Integer,
    Column,
    ForeignKey,
    String,
)  # Ensure this import is present
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    icon = Column(String)
    token = Column(
        String, nullable=True
    )  # Add this line to include the token attribute


class Video(Base):
    __tablename__ = "Video"  # Capital 'V' to match the actual table name

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.id"))  # Match the case for "User.id"
    description = Column(String)
    video_url = Column(String)
    title = Column(String)

    comments = relationship("Comment", back_populates="video")


class Comment(Base):
    __tablename__ = "Comment"  # Capital 'C' to match the actual table name

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(Integer, ForeignKey("Video.id"))  # Match the case for "Video.id"
    content = Column(String)
    user_id = Column(Integer)

    video = relationship("Video", back_populates="comments")
