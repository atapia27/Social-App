from pydantic import BaseModel

class Video(BaseModel):
    user_id: str
    description: str
    video_url: str
    title: str

class Comment(BaseModel):
    video_id: str
    content: str
    user_id: str

class User(BaseModel):
    email: str
    username: str
    icon: str