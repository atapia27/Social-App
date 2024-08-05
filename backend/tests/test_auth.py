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


def test_post_user():
    # Define a new user's data
    new_user_data = {
        "email": "newuser@example.com",
        "username": "newuser",
        "icon": "icon_path",
    }

    # Send a POST request to create a new user
    response = client.post("/users/users/", json=new_user_data)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Parse the response JSON
    response_data = response.json()

    # Assert that the response contains the expected fields
    assert "access_token" in response_data
    assert "token_type" in response_data
    assert response_data["token_type"] == "bearer"
    assert "username" in response_data
    assert response_data["username"] == "newuser"
    assert "icon" in response_data
    assert "id" in response_data
    assert response_data["icon"] == "icon_path"
    print(response_data)


# Helper function to create a user with unique data for testing
def register_user(email, username, icon):
    user_data = {
        "email": email,
        "username": username,
        "icon": icon,
    }
    response = client.post("/users/users/", json=user_data)
    if response.status_code != 200:
        print(f"User creation failed: {response.status_code}, {response.json()}")
    return response


# Test case to verify that a user automatically logs in after registration, so you cannot login again
def test_login_after_register():
    unique_email = "testuser_login_after_register@example.com"
    unique_username = "testuser_login_after_register"
    unique_icon = "icon_1"

    # Register the user
    response = register_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    assert "access_token" in user_data

    # Attempt to login the user again, expecting a 400 error
    login_data = {"email": unique_email}
    response = client.post("/auth/login/", json=login_data)
    assert response.status_code == 400

    error_response = response.json()
    assert error_response["detail"] == "User already logged in"


# Test case to verify that logging out with an already used token is handled correctly
def test_attempt_logout_twice():
    unique_email = "testuser_relogin@example.com"
    unique_username = "testuser_relogin"
    unique_icon = "icon_3"

    # Register the user
    response = register_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    assert "access_token" in user_data
    access_token = user_data["access_token"]

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
def test_register_performs_auto_login():
    unique_email = "testuser_auto_login@example.com"
    unique_username = "testuser_auto_login"
    unique_icon = "icon_4"

    # Register the user and verify automatic login
    response = register_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    user_data = response.json()
    access_token = user_data["access_token"]
    assert "access_token" in user_data
    print(f"access_token: {access_token}")

    # Verify the user is correctly stored in the database
    with TestingSessionLocal() as db:
        db_user = db.query(User).filter(User.email == unique_email).first()
        assert db_user is not None
        assert db_user.username == unique_username
        print(f"db_user.token: {db_user.token}")
        assert access_token == db_user.token


# Test case to verify that a user can be registered and then logged out successfully
def test_register_and_logout_user():
    unique_email = "testuser_logout@example.com"
    unique_username = "testuser_logout"
    unique_icon = "icon_2"

    # Register the user
    response = register_user(unique_email, unique_username, unique_icon)
    assert response.status_code == 200
    register_response = response.json()
    access_token = register_response["access_token"]
    assert "access_token" in register_response

    # check token is valid
    assert access_token is not None
    assert access_token != ""
    print(f"access_token: {access_token}")

    # Logout the user using the access token
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.post("/auth/logout", headers=headers)

    # check response status code
    assert response.status_code == 200
    logout_response = response.json()
    assert logout_response["message"] == "Successfully logged out"

    # Verify the token is invalidated in the database
    with TestingSessionLocal() as db:
        db_user = db.query(User).filter(User.email == unique_email).first()
        assert db_user is not None
        assert db_user.token is None


if __name__ == "__main__":
    pytest.main()
