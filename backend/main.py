# backend\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth.auth_routers import router as auth_router

# dont need user router
# from backend.users.user_routers import router as user_router

app = FastAPI()

# CORS middleware to allow requests from your Next.js frontend
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
# app.include_router(user_router, prefix="/users", tags=["users"])
