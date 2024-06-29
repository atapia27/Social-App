from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str
    icon: str
    
class Video(BaseModel):
    user_id: int
    description: str
    video_url: str
    title: str

class Comment(BaseModel):
    video_id: int
    content: str
    user_id: str