from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from app import oauth2, schemas, models, utils
from ..database import get_db

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=schemas.Token)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    # OAuth2PasswordRequestForm asks for 2 fields 'username', 'password'
    user = (
        db.query(models.User)
        .filter(models.User.email == user_credentials.username)
        .first()
    )

    # If the email does not exist, OR if the provided password doesn't match db hashed password
    if not user or not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials."
        )

    encoding_data = {"user_id": user.id}

    access_token = oauth2.create_access_token(encoding_data)

    return {"access_token": access_token, "token_type": "bearer"}
