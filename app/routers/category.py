from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.utils import get_user_budget, get_category_by_id, get_user_category

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter(prefix="/category", tags=["Categories"])


# testing purposes
@router.get("/all", response_model=List[schemas.CategoryOut])
def get_all_categories(db: Session = Depends(get_db)):
    
    categories = db.query(models.Category).all()
    return categories


@router.get("/", response_model=List[schemas.CategoryOut])
def get_categories(
    db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)
):
    existing_budget = get_user_budget(db, current_user.id)

    if not existing_budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {current_user.id} does not have a budget",
        )

    categories = (
        db.query(models.Category)
        .filter(
            models.Category.budget_id == existing_budget.id,
            models.Category.deleted_at.is_(None),
        )
        .all()
    )

    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No set categories"
        )

    return categories


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.CategoryOut
)
def create_category(
    category_create: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    existing_budget = get_user_budget(db, current_user.id)

    if not existing_budget or existing_budget.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {current_user.id} does not have a budget",
        )

    category_data = {
        **category_create.model_dump(),
        "budget_id": existing_budget.id,
    }

    new_category = models.Category(**category_data)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


@router.put("/{id}", response_model=schemas.CategoryOut)
def update_category(
    id: int,
    category: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    existing_category = get_user_category(db, current_user.id, id)

    if not existing_category or existing_category.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {id} not found",
        )

    existing_category.updated_at = func.now()
    existing_category.user_id = current_user.id
    existing_category.owner = current_user.budget.owner

    db.query(models.Category).filter(models.Category.id == id).update(
        category.model_dump(), synchronize_session=False
    )
    db.commit()

    return existing_category


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    existing_category = get_category_by_id(db, id)

    if not existing_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {id} not found",
        )

    if existing_category.budget.owner.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized",
        )

    if existing_category.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {id} has already been deleted",
        )

    existing_category.deleted_at = func.now()
    db.commit()
