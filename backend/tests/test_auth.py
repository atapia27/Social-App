import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, localSession
from backend.models import User
from backend.dependencies import get_db
import uuid

# Define the test database URL for SQLite in-memory database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create the SQLAlchemy engine for connecting to the SQLite database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure session maker for testing, disabling autocommit and autoflush for transactions
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override function to use the test database session
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Apply the dependency override for the database session
app.dependency_overrides[get_db] = override_get_db

# Function to reset the test database by dropping all tables and recreating them
def reset_test_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

# Initialize the test database
reset_test_database()

# Initialize the TestClient with our FastAPI app for making test requests
client = TestClient(app)

# Helper function to create a user with unique data for testing
def register_test_user(email, username, icon):
    user_data = {
        "email": email,
        "username": username,
        "icon": icon,
    }
    response = client.post("/users/users/", json=user_data)
    if response.status_code != 200:
        print(f"User creation failed: {response.status_code}, {response.json()}")
    return response

# Test case to verify that a user can be created and then logged in successfully
def test_register_user_and_verify_login():
    unique_email = "testuser_create_login@example.com"
    unique_username = "testuser_create_login"
    unique_icon = "icon_1"

    # Create a user
    response = register_test_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    assert "access_token" in user_data

    # Attempt to login the newly created user
    login_data = {"email": unique_email}
    response = client.post("/auth/login/", json=login_data)
    assert response.status_code == 200
    login_response = response.json()
    assert "access_token" in login_response
    assert login_response["username"] == unique_username

    # Verify the user is correctly stored in the database
    with TestingSessionLocal() as db:
        db_user = db.query(User).filter(User.email == unique_email).first()
        assert db_user is not None
        assert db_user.username == unique_username

# Test case to verify that a user can log out successfully
def test_create_and_logout_user():
    unique_email = "testuser_logout@example.com"
    unique_username = "testuser_logout"
    unique_icon = "icon_2"

    # Create and login the user
    response = register_test_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    assert "access_token" in user_data

    # Attempt to logout the user
    login_data = {"email": unique_email}
    response = client.post("/auth/login/", json=login_data)
    assert response.status_code == 200
    login_response = response.json()
    access_token = login_response["access_token"]
    assert "access_token" in login_response

    # Logout the user using the access token
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.post("/auth/logout", headers=headers)
    assert response.status_code == 200
    logout_response = response.json()
    assert logout_response["message"] == "Successfully logged out"

    # Verify the token is invalidated in the database
    with TestingSessionLocal() as db:
        db_user = db.query(User).filter(User.email == unique_email).first()
        assert db_user is not None
        assert db_user.token is None

# Test case to verify that logging out with an already used token is handled correctly
def test_login_and_attempt_logout_twice():
    unique_email = "testuser_relogin@example.com"
    unique_username = "testuser_relogin"
    unique_icon = "icon_3"

    # Create and login the user
    response = register_test_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    assert "access_token" in user_data

    # Attempt to logout the user twice, expecting the second attempt to fail
    login_data = {"email": unique_email}
    response = client.post("/auth/login/", json=login_data)
    assert response.status_code == 200
    login_response = response.json()
    access_token = login_response["access_token"]
    assert "access_token" in login_response

    # First logout attempt
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.post("/auth/logout", headers=headers)
    assert response.status_code == 200
    logout_response = response.json()
    assert logout_response["message"] == "Successfully logged out"

    # Second logout attempt with the same token, expecting failure
    response = client.post("/auth/logout", headers=headers)
    assert response.status_code == 401
    error_response = response.json()
    assert error_response["message"] == "Token already expired or invalid"

# Test case to verify that a user is automatically logged in upon registration
def test_register_and_auto_login():
    unique_email = "testuser_auto_login@example.com"
    unique_username = "testuser_auto_login"
    unique_icon = "icon_4"

    # Register the user and verify automatic login
    response = register_test_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    assert "access_token" in user_data

    # Verify the user is logged in automatically by checking the access token
    login_data = {"email": unique_email}
    response = client.post("/auth/login/", json=login_data)
    assert response.status_code == 200
    login_response = response.json()
    assert "access_token" in login_response
    assert login_response["username"] == unique_username

if __name__ == "__main__":
    pytest.main()