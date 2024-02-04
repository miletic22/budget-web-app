from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app import schemas
from app.config import settings
from app.main import app

SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


client = TestClient(app)


def test_create_user():
    res = client.post(
        "/users/", json={"email": "hello12345@gmail.com", "password": "password123"}
    )

    new_user = schemas.UserOut(**res.json())
    assert new_user.email == "hello12345@gmail.com"
    assert res.status_code == 201
