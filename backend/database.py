# backend/database.py

# from sqlalchemy.ext.declarative import declarative_base  # deprecated
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="backend/.env")

# Fetch the database URL from environment variables
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure session maker
localSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative class definitions
print("Creating Base class in database.py")
Base = declarative_base()
