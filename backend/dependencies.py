# backend/dependencies.py
from backend.database import localSession


def get_db():
    db = localSession()
    try:
        yield db
    finally:
        db.close()
