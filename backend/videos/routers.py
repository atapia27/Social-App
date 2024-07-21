import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import timedelta
from backend.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth.utils import create_access_token
from backend.dependencies import get_db
from backend import crud, schemas
import httpx

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/api/data")
async def get_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://take-home-assessment-423502.uc.r.appspot.com/endpoint")
        return response.json()