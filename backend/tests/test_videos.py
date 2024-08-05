# backend/tests/test_videos.py

import pytest
from httpx import AsyncClient
from backend.videos import video_routers
from backend import schemas

# No need to import TestClient for async tests
# from fastapi.testclient import TestClient

# Your imports remain the same...


# @pytest.mark.asyncio
# async def test_post_video_data():
#     video = schemas.CreateVideo(user_id="john_smith", description="This is a test video", video_url="https://www.youtube.com/watch?v=123", title="Test Video")
#     response = await video_routers.post_video_data(video)
#     assert response is not None
#     assert response["success"] is True
#     assert "data" in response


@pytest.mark.asyncio
async def test_get_video_data():
    user_id = "john_smith"
    response = await video_routers.get_videos_data(user_id)
    assert response is not None
    # print formatted data
    for video in response["videos"][:5]:
        print(f"Title: {video['title']}")
        print(f"Description: {video['description']}")
        print(f"Video URL: {video['video_url']}")
        print(f"Number of comments: {video['num_comments']}")
        print(f"Created at: {video['created_at']}")
        print(f"Video ID: {video['id']}")
        print(f"User ID: {video['user_id']}")
        print("\n")


# @pytest.mark.asyncio
# async def test_put_video_data():
#     video = schemas.EditVideo(video_id="jt8mwFIauwdRANprIhoQ", description="This is an updated test video", title="Updated Test Video")
#     response = await video_routers.put_video_data(video)
#     assert response is not None
#     assert response["success"] is True
#     assert "data" in response

# @pytest.mark.asyncio
# async def test_get_video_data():
#     user_id = "john_smith"
#     response = await video_routers.get_videos_data(user_id)
#     assert response is not None
#     #print formatted data
#     for video in response["videos"][:2]:
#         print(f"Title: {video['title']}")
#         print(f"Description: {video['description']}")
#         print(f"Video URL: {video['video_url']}")
#         print(f"Number of comments: {video['num_comments']}")
#         print(f"Created at: {video['created_at']}")
#         print(f"Video ID: {video['id']}")
#         print(f"User ID: {video['user_id']}")
#         print("\n")

# @pytest.mark.asyncio
# async def test_get_single_video_data():
#     video_id = "ikJNJRXEiTfzrluR4ewx"
#     data = await video_routers.get_single_video_data(video_id)
#     assert data is not None
#     assert "created_at" in data["video"]
#     assert "video_url" in data["video"]
#     assert "user_id" in data["video"]
#     assert "description" in data["video"]
#     assert "title" in data["video"]
#     assert "num_comments" in data["video"]
#     assert video_id == data["video"]["id"]

# @pytest.mark.asyncio
# async def test_post_video_comments_data():
#     comment = schemas.CreateComment(video_id="jt8mwFIauwdRANprIhoQ", content="This is a test comment", user_id="john_smith")
#     response = await video_routers.post_video_comments_data(comment)
#     assert response is not None
#     assert response["success"] is True
#     assert "data" in response

# @pytest.mark.asyncio
# async def test_get_comments_data():
#     video_id = "g2oM9PJafjJtsN5zGLeX"
#     data = await video_routers.get_comments_data(video_id)
#     assert data is not None
#     assert "comments" in data
#     for comment in data["comments"]:
#         assert "content" in comment
#         assert "user_id" in comment
#         assert comment["video_id"] == video_id


# If you have more async tests, remember to add @pytest.mark.asyncio to them as well
