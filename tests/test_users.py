import pytest
from jose import jwt

from app import schemas
from app.config import settings

from .database import client, session  # noqa: F401


@pytest.fixture
def test_user(client):
    user_data = {"email": "test@gmail.com", "password": "password"}
    response = client.post("/users/", json=user_data)

    assert response.status_code == 201

    new_user = response.json()
    new_user["password"] = user_data["password"]
    return new_user


def test_create_user(client):
    response = client.post(
        "/users/", json={"email": "test1@gmail.com", "password": "password"}
    )

    new_user = schemas.UserOut(**response.json())
    assert new_user.email == "test1@gmail.com"
    assert response.status_code == 201


def test_user_login(test_user, client):
    response = client.post(
        "/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    login_res = schemas.Token(**response.json())
    payload = jwt.decode(
        login_res.access_token, settings.secret_key, algorithms=[settings.algorithm]
    )
    id = payload.get("user_id")

    assert id == test_user["id"]
    assert login_res.token_type == "bearer"
    assert response.status_code == 200

