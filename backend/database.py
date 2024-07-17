# backend\database.py
from dotenv import load_dotenv

load_dotenv()

import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Fetch the database URL from environment variables
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL  # Ensure this is a valid PostgreSQL connection string
)

# Configure session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative class definitions
Base = declarative_base()
