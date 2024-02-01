from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session


from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])

