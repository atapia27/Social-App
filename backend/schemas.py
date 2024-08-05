# backend/schemas.py

from pydantic import BaseModel


class User(BaseModel):
    id: str
    first_name: str
    last_name: str
    icon: str
    logged_in: bool


class CreateUser(BaseModel):
    first_name: str
    last_name: str
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


class LoginRequest(BaseModel):
    user_id: str
