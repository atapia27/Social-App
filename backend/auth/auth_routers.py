# backend/auth/routers.py

import logging
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from backend.dependencies import get_db
from backend import crud, schemas
from pydantic import ValidationError

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register")
async def post_user(user: schemas.CreateUser, db: Session = Depends(get_db)):
    try:
        new_user = crud.create_user(db=db, user=user)

        response = JSONResponse(
            content={
                "user_id": new_user.id,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "icon": new_user.icon,
                "loggedIn": new_user.logged_in,
            }
        )
        return response

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=jsonable_encoder({"errors": e.errors(), "body": e.body}),
        )
    except HTTPException as e:
        raise e  # Re-raise HTTP exceptions as they are
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/login")
async def login_user(
    login_request: schemas.LoginRequest, db: Session = Depends(get_db)
):
    try:
        user_id = login_request.user_id
        db_user = crud.retrieve_user_by_id(db, user_id=user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if db_user.logged_in:
            raise HTTPException(status_code=400, detail="User already logged in")

        db_user.logged_in = True
        db.commit()

        response = JSONResponse(
            content={
                "user_id": db_user.id,
                "first_name": db_user.first_name,
                "last_name": db_user.last_name,
                "icon": db_user.icon,
                "loggedIn": db_user.logged_in,
            }
        )

        return response

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=jsonable_encoder({"errors": e.errors(), "body": e.body}),
        )
    except HTTPException as e:
        raise e  # Re-raise HTTP exceptions as they are
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/logout")
async def logout_user(
    login_request: schemas.LoginRequest, db: Session = Depends(get_db)
):
    try:
        user_id = login_request.user_id
        db_user = crud.retrieve_user_by_id(db, user_id=user_id)
        if db_user:
            db_user.logged_in = False
            db.commit()
            response = JSONResponse(content={"message": "Successfully logged out"})
            return response
        else:
            return JSONResponse(
                content={"message": "User not found"},
                status_code=status.HTTP_404_NOT_FOUND,
            )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=jsonable_encoder({"errors": e.errors(), "body": e.body}),
        )
    except Exception as e:
        response = JSONResponse(
            content={"message": "Logout failed due to server error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        return response
