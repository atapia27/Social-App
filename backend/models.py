# backend\models.py
from sqlalchemy import (
    Integer,
    Column,
    ForeignKey,
    String,
    DateTime,
)  # Removed Integer, ensure this import is present
from sqlalchemy.orm import relationship
from backend.database import Base
import uuid

class User(Base):
    __tablename__ = "User"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    icon = Column(String)
    token = Column(String, nullable=True)  # Token attribute added

class Video(Base):
    __tablename__ = "Video"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)

    created_at = Column(DateTime)
    video_url = Column(String)
    user_id = Column(String, ForeignKey("User.id"))  # ForeignKey reference updated
    description = Column(String)
    title = Column(String)
    num_comments = Column(Integer)  # Integer type added
    
class Comment(Base):
    __tablename__ = "Comment"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    created_at= Column(DateTime)
    content = Column(String)
    user_id = Column(String, ForeignKey("User.id"))  # ForeignKey to User.id added
    video_id = Column(String, ForeignKey("Video.id"))  # ForeignKey reference updated

# commands to run in the terminal
# alembic revision --autogenerate -m "autogenerate id str"
# alembic upgrade head