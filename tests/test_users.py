from app import schemas
from .database import client, session  # noqa: F401


def test_create_user(client):
    res = client.post(
        "/users/", json={"email": "hello12345@gmail.com", "password": "password123"}
    )

    new_user = schemas.UserOut(**res.json())
    assert new_user.email == "hello12345@gmail.com"
    assert res.status_code == 201
    
