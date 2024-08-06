from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.dependencies import get_db
from backend import schemas
import httpx

BASE_URL = "https://take-home-assessment-423502.uc.r.appspot.com/api/videos"

router = APIRouter()

##############################################################################################
#  helper functions for async http requests

async def async_http_get(url: str, params: dict = None):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))


async def async_http_post(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data)
            response.raise_for_status()
            return {"success": True, "data": response.json()}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))


##############################################################################################
# functions to interact with the external API

async def post_video_data(video: schemas.CreateVideo):
    url = BASE_URL
    data = video.dict()  # Assuming this method returns a dict suitable for JSON serialization
    return await async_http_post(url, data)


async def get_videos_data(user_id: str):
    url = BASE_URL
    params = {"user_id": user_id}
    return await async_http_get(url, params)


async def post_video_comments_data(comment: schemas.CreateComment):
    url = BASE_URL + "/comments"
    data = comment.dict()  # Assuming this method returns a dict suitable for JSON serialization
    return await async_http_post(url, data)


async def get_comments_data(video_id: str):
    url = BASE_URL + f"/comments"
    params = {"video_id": video_id}
    return await async_http_get(url, params)


##############################################################################################
# API routes

@router.post("/videos")
async def post_videos(video: schemas.CreateVideo):
    data = await post_video_data(video)
    return data


@router.get("/videos/{user_id}")
async def get_videos(user_id: str):
    data = await get_videos_data(user_id)
    return data


@router.post("/videos/comments")
async def post_video_comments(comment: schemas.CreateComment):
    data = await post_video_comments_data(comment)
    return data


@router.get("/videos/comments/{video_id}")
async def get_comments(video_id: str):
    data = await get_comments_data(video_id)
    return data
