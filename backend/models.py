# backend/models.py

from sqlalchemy import (
    Integer,
    Column,
    ForeignKey,
    String,
    Boolean,
)  # Ensure these imports are present
from sqlalchemy.orm import relationship
from backend.database import Base


class User(Base):
    __tablename__ = "User"
    id = Column(String, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    icon = Column(String)
    logged_in = Column(Boolean, default=False)  # Boolean to indicate login status


class Video(Base):
    __tablename__ = "Video"
    id = Column(String, primary_key=True, index=True)
    created_at = Column(String)
    video_url = Column(String)
    user_id = Column(String, ForeignKey("User.id"))  # ForeignKey reference to User.id
    description = Column(String)
    title = Column(String)
    num_comments = Column(Integer)  # Integer type added


class Comment(Base):
    __tablename__ = "Comment"
    id = Column(String, primary_key=True, index=True)
    created_at = Column(String)
    content = Column(String)
    user_id = Column(String, ForeignKey("User.id"))  # ForeignKey to User.id
    video_id = Column(
        String, ForeignKey("Video.id")
    )  # ForeignKey reference to Video.id


# commands to run in the terminal
# alembic revision --autogenerate -m "autogenerate id str"
# alembic upgrade head
