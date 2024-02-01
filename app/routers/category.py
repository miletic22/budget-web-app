from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session


from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])


# for easier testing purposes
@router.get("/all", response_model=List[schemas.CategoryOut])
def get_all_categories(
    db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)
):
    # Filter categories no matter2 if they wzere soft-deleted
    categories = db.query(models.Category).all()
    return categories


@router.get("/", response_model=List[schemas.CategoryOut])
def get_categories(
    db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)
):
    # Retrieve the categories for the current user
    budget_query = db.query(models.Budget).filter(
        models.Budget.user_id == current_user.id
    )
    existing_budget = budget_query.first()

    print(existing_budget)
    if not existing_budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {current_user.id} does not have a budget",
    )
    
    categories = (
        db.query(models.Category)
        .filter(
            models.Category.budget_id == current_user.budget.id,
            models.Category.deleted_at.is_(
                None
            ),  # Exclude categories where deleted_at is set
        )
        .all()
    )
    # Check if the category exists
    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No set categories"
        )

    return categories


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.CategoryOut)
def create_category(
    category_create: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):

    budget_query = db.query(models.Budget).filter(
        models.Budget.user_id == current_user.id
    )
    existing_budget = budget_query.first()

    if existing_budget.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {current_user.id} does not have a budget",
    )

    category_data = {
        **category_create.model_dump(),
        "budget_id": current_user.budget.id,
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
    category_query = db.query(models.Category).filter(models.Category.id == id)
    existing_category = category_query.first()

    # Check if they are updating their own
    if existing_category.budget.owner.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized",
    )

    # Check if category exists
    if not existing_category or existing_category.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {id} not found",
        )

        
    existing_category.updated_at = func.now()

    # Automatically set user_id and owner from current_user
    existing_category.user_id = current_user.id
    existing_category.owner = current_user.budget.owner 

    # Update the category with the new data
    category_query.update(category.model_dump(), synchronize_session=False)
    db.commit()

    return existing_category
 

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    # Check if category exists
    category_query = db.query(models.Category).filter(models.Category.id == id)
    existing_category = category_query.first()
    
    # budget_id = existing_category.budget_id
    # budget_query = db.query(models.Budget).filter(models.Budget.id == budget_id).first()
    # if budget_query.owner.id != current_user.id:
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

    # Check if category has already been deleted
    if existing_category.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category for with id {id} has already been deleted",
    )

    # Soft delete the category
    existing_category.deleted_at = func.now()
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

