from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.dependencies import get_db
from backend import schemas, crud
import httpx
import logging

BASE_URL = "https://take-home-assessment-423502.uc.r.appspot.com/api/videos"
logger = logging.getLogger(__name__)

router = APIRouter()

async def async_http_get(url: str, params: dict = None):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP GET request failed for {url} with params {params}: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

async def async_http_post(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data)
            response.raise_for_status()
            return {"success": True, "data": response.json()}
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP POST request failed for {url} with data {data}: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

async def post_video_data(video: schemas.CreateVideo):
    url = BASE_URL
    data = video.dict()
    return await async_http_post(url, data)

async def get_videos_data(user_id: str):
    url = BASE_URL
    params = {"user_id": user_id}
    print(f"Fetching videos for user_id: {user_id}")
    logger.info(f"Fetching videos for user_id: {user_id}")
    return await async_http_get(url, params)

async def get_all_videos_data(user_ids: list):
    videos = []
    for user_id in user_ids:
        print(f"Fetching videos for user_id: {user_id}")
        logger.info(f"Fetching videos for user_id: {user_id}")
        url = BASE_URL
        params = {"user_id": user_id}
        user_videos = await async_http_get(url, params)
        if "videos" in user_videos:
            videos.extend(user_videos["videos"])
            print(f"Fetched {len(user_videos['videos'])} videos for user_id: {user_id}")
            logger.info(f"Fetched {len(user_videos['videos'])} videos for user_id: {user_id}")
        else:
            print(f"No videos found for user_id: {user_id}")
            logger.warning(f"No videos found for user_id: {user_id}")
    return {"videos": videos}

async def post_video_comments_data(comment: schemas.CreateComment):
    url = BASE_URL + "/comments"
    data = comment.dict()
    return await async_http_post(url, data)

async def get_comments_data(video_id: str):
    url = BASE_URL + "/comments"
    params = {"video_id": video_id}
    return await async_http_get(url, params)

@router.post("/videos")
async def post_videos(video: schemas.CreateVideo):
    data = await post_video_data(video)
    return data

@router.get("/videos/{user_id}")
async def get_videos(user_id: str):
    data = await get_videos_data(user_id)
    return data

@router.get("/videos/all")
async def get_all_videos(db: Session = Depends(get_db)):
    users = crud.retrieve_users(db)
    print(f"Retrieved users: {users}")
    logger.info(f"Retrieved users: {users}")
    user_ids = [user.id for user in users]
    data = await get_all_videos_data(user_ids)
    print(f"Total videos fetched: {len(data['videos'])}")
    logger.info(f"Total videos fetched: {len(data['videos'])}")
    return data

@router.post("/videos/comments")
async def post_video_comments(comment: schemas.CreateComment):
    data = await post_video_comments_data(comment)
    return data

@router.get("/videos/comments/{video_id}")
async def get_comments(video_id: str):
    data = await get_comments_data(video_id)
    return data
