# backend/tests/test_videos.py

import pytest
from httpx import AsyncClient
from backend.videos.video_routers import fetch_video_data, get_videos

# No need to import TestClient for async tests
# from fastapi.testclient import TestClient

# Your imports remain the same...

@pytest.fixture
def video_data():
    return {
        "videos": [
            {
                "created_at": "2024-06-20T03:25:22.132164+00:00",
                "video_url": "sefsefsef",
                "user_id": "1",
                "description": "1",
                "title": "1",
                "num_comments": 3,
                "id": "Oxv48rpAOLuFCIF3Ou3t",
            },
            {
                "created_at": "2024-06-20T03:19:02.205847+00:00",
                "video_url": "",
                "user_id": "1",
                "description": "string",
                "title": "string1",
                "num_comments": 1,
                "id": "ikJNJRXEiTfzrluR4ewx",
            },
            {
                "created_at": "2024-06-20T03:17:57.305544+00:00",
                "video_url": "",
                "user_id": "1",
                "description": "",
                "title": "",
                "num_comments": 0,
                "id": "QD388Sd7AkOWNnfkIvUH",
            },
            {
                "created_at": "2024-06-19T23:19:41.333586+00:00",
                "video_url": "http://localhost:5173/",
                "user_id": "1",
                "description": "1",
                "title": "1",
                "num_comments": 0,
                "id": "QBH11HWAayOGOZa0yHF6",
            },
            {
                "created_at": "2024-06-13T17:46:57.365141+00:00",
                "video_url": "https://www.youtube.com/watch?v=n4IQOBka8bc",
                "user_id": "1",
                "description": "desc test",
                "title": "title test",
                "num_comments": 2,
                "id": "v04ZcX5qslALBtbgwXYY",
            },
            {
                "created_at": "2024-06-12T16:53:09.822309+00:00",
                "video_url": "youtube.com",
                "user_id": "1",
                "description": "description",
                "title": "title",
                "num_comments": 3,
                "id": "4jdcmR2iWVFmqaqBpIQJ",
            },
            {
                "created_at": "2024-06-11T21:59:06.716654+00:00",
                "video_url": "youtube.com",
                "user_id": "1",
                "description": "description",
                "title": "title",
                "num_comments": 5,
                "id": "y1yqUmdJIPUPCXJEH6OC",
            },
            {
                "created_at": "2024-06-11T16:57:16.715524+00:00",
                "video_url": "url",
                "user_id": "1",
                "description": "description",
                "title": "video title",
                "num_comments": 1,
                "id": "dWQFOumgKNNyl4W9JBSX",
            },
        ]
    }

@pytest.mark.asyncio
async def test_fetch_video_data(video_data):
    user_id = "1"
    data = await fetch_video_data(user_id)
    assert data is not None
    assert data == video_data




# If you have more async tests, remember to add @pytest.mark.asyncio to them as well
