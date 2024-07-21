# backend/auth/utils.py

import logging
from datetime import datetime, timedelta, timezone, time
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, Request, Security, Depends, status
from fastapi.security import OAuth2PasswordBearer
from backend import schemas
from backend.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

UTC = timezone.utc

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info("Access token created with expiration: %s", expire)
    return encoded_jwt

def decode_jwt(token: str, secret_key: str, algorithms: list):
    try:
        return jwt.decode(token, secret_key, algorithms=algorithms)
    except JWTError as e:
        raise e

# Example of using the decode_jwt function in your verify_token and get_current_user functions

async def verify_token(request: Request, token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            logger.warning("Token verification failed: no email found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        request.state.user = schemas.TokenData(email=email)
        logger.info("Token verified for user: %s", email)
    except ExpiredSignatureError:
        logger.warning("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        logger.warning("Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(token: str = Security(oauth2_scheme)):
    try:
        payload = decode_jwt(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            logger.warning("Token verification failed: no email found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        logger.info("Current user fetched: %s", email)
        return schemas.TokenData(email=email)
    except ExpiredSignatureError:
        logger.warning("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        logger.warning("Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )