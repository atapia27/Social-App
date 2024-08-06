# backend\main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from backend.auth.auth_routers import router as auth_router

# Initialize FastAPI app
app = FastAPI()

# CORS middleware to allow requests from your Next.js frontend
origins = [
    "http://localhost:3000",
    "https://social-app-y6hc.onrender.com",  # Add your render URL here
    "https://peaceful-taiyaki-8b2ee8.netlify.app",  # Add your Netlify URL here
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

# Entry point for Uvicorn
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)