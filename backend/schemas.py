# backend\schemas.py
from pydantic import BaseModel


class User(BaseModel):
    email: str
    username: str
    icon: str

class CreateVideo(BaseModel):
    user_id: str
    description: str
    video_url: str
    title: str
    
class EditVideo(BaseModel):
    video_id: str
    description: str
    title: str


class CreateComment(BaseModel):
    video_id: str
    content: str
    user_id: str


# New addition
class TokenData(BaseModel):
    email: str


# New addition
class LoginRequest(BaseModel):
    email: str

