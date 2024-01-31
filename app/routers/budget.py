from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.utils import get_budget_query_by_id, reactivate_soft_deleted_budget

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("/all", response_model=List[schemas.BudgetOut])
def get_all_budgets(
    db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)
):
    # Filter budgets no matter if they were soft-deleted
    budgets = db.query(models.Budget).all()
    return budgets


@router.get("/", response_model=List[schemas.BudgetOut])
def get_budgets(
    db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)
):
    # Filter only non-deleted budgets
    budgets = db.query(models.Budget).filter(models.Budget.deleted_at.is_(None)).all()
    return budgets


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.BudgetOut)
def create_budget(
    budget: schemas.BudgetCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    # Check if a budget already exists for the user
    existing_budget = (
        db.query(models.Budget)
        .filter(
            models.Budget.user_id == budget.user_id,  # Fix the condition here
            models.Budget.deleted_at.is_(None),
        )
        .first()
    )  # Exclude soft-deleted budgets
    if existing_budget:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with id: {budget.user_id} already has a budget",
        )

    # Check if the user exists
    user = db.query(models.User).filter(models.User.id == budget.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {budget.user_id} does not exist",
        )

    # Try to reactivate a soft-deleted budget
    soft_deleted_budget = reactivate_soft_deleted_budget(
        db, budget.user_id, budget.model_dump()
    )
    if soft_deleted_budget:
        return soft_deleted_budget

    # Create a new budget if all checks pass
    new_budget_data = {**budget.model_dump(), "user_id": user.id}
    new_budget = models.Budget(**new_budget_data)
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget


@router.put("/{id}", response_model=schemas.BudgetOut)
def update_budget(
    id: int,
    budget: schemas.BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    # Check if budget exists
    budget_query = get_budget_query_by_id(db, id)
    if not budget_query.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with id: {id} does not exist",
        )

    budget_query.first().updated_at = func.now()
    budget_query.update(budget.model_dump(), synchronize_session=False)

    db.commit()

    return budget_query.first()


@router.delete("/{id}", response_model=schemas.BudgetOut)
def delete_budget(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    # Check if budget exists
    existing_budget = get_budget_query_by_id(db, id)
    if not existing_budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with id: {id} does not exist",
        )

    # Check if budget exists was soft deleted
    if existing_budget.first().deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with id: {id} has already been deleted",
        )

    existing_budget.first().deleted_at = func.now()
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
