# backend/users/video_routers.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth.utils import create_access_token
from backend.dependencies import get_db
from backend import crud, schemas
from fastapi.responses import JSONResponse
import httpx

router = APIRouter()


async def fetch_video_data(user_id: str):
    # Example modification: append user_id to the request URL or as a parameter
    url = (
        f"https://take-home-assessment-423502.uc.r.appspot.com/videos?user_id={user_id}"
    )
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


@router.get("/videos/{user_id}")
# async def get_videos(user_id: str, db: Session = Depends(get_db)):
async def get_videos(user_id: str):
    try:
        data = await fetch_video_data(user_id)
        return data
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
