# backend/tests/test_auth.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, localSession
from backend.models import User
from backend.dependencies import get_db

# Define the test database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure session maker for testing
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Initialize the test database
Base.metadata.create_all(bind=engine)

# Initialize the TestClient with our FastAPI app
client = TestClient(app)

# Helper function to create a user
def create_test_user():
    user_data = {
        "email": "testuser6@example.com",
        "username": "testuser6",
        "icon": "icon_url",
    }
    response = client.post("/users/users/", json=user_data)
    return response

# Test case to create a user and verify login
def test_create_user_and_login():
    # Create a user
    response = create_test_user()
    assert response.status_code == 200  # Adjust to match the actual status code
    user_data = response.json()
    assert "access_token" in user_data

    # Login the user
    login_data = {
        "email": "testuser6@example.com",
    }
    response = client.post("/auth/login/", json=login_data)
    assert response.status_code == 200
    login_response = response.json()
    assert "access_token" in login_response
    assert login_response["username"] == "testuser6"

    # Verify the user in the database
    with TestingSessionLocal() as db:
        db_user = db.query(User).filter(User.email == "testuser6@example.com").first()
        assert db_user is not None
        assert db_user.username == "testuser6"

if __name__ == "__main__":
    pytest.main()
