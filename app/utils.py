# utils.py

from fastapi import HTTPException, status
from . import models
from passlib.context import CryptContext
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func


# Create a password context for hashing passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash(password: str):
    """
    Hashes the provided password using the configured password context.

    Input:
        password (str): Password to be hashed.

    Output:
        str: Hashed password.
    """
    return pwd_context.hash(password)


def reactivate_soft_deleted_budget(
    db: Session, user_id: int, budget_data: dict
) -> models.Budget:
    """
    Reactivates a soft-deleted budget for a given user.

    Input:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID for whom to reactivate the budget.
        budget_data (dict): Data to update the soft-deleted budget.

    Output:
        models.Budget: Reactivated budget if found, else None.
    """
    # Query the soft-deleted budget for the user
    budget_query = db.query(models.Budget).filter(
        models.Budget.user_id == user_id, models.Budget.deleted_at.isnot(None)
    )

    # Execute the query to get the budget instance
    soft_deleted_budget = budget_query.first()

    if soft_deleted_budget:
        # Reactivate the soft-deleted budget by updating fields
        budget_query.update(budget_data, synchronize_session=False)

        # Set deleted_at to None and update updated_at
        soft_deleted_budget.deleted_at = None
        soft_deleted_budget.updated_at = func.now()

        db.commit()

        return soft_deleted_budget

    return None


def get_budget_query_by_id(db: Session, user_id: int) -> models.Budget:
    """
    Retrieves a budget from the database based on its user_id.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): Unique identifier of the user whose budget to retrieve.

    Returns:
        models.Budget: The budget if found, otherwise None.
    """
    return db.query(models.Budget).filter(models.Budget.user_id == user_id)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies that the user-provided password matches the hashed version in the database.

    Args:
        plain_password (str): Provided password for authentication.
        hashed_password (str): Hashed password stored in the database.

    Returns:
        bool: True if matched, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_category_by_id(db: Session, category_id: int):
    """
    Retrieves a category from the database based on its ID.

    Input:
        db (Session): SQLAlchemy database session.
        category_id (int): Unique identifier of the category to retrieve.

    Output:
        models.Category: The category if found, otherwise None.
    """
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def get_user_budget(db: Session, user_id: int):
    """
    Retrieves a budget from the database based on its user ID.

    Input:
        db (Session): SQLAlchemy database session.
        user_id (int): Unique identifier of the user whose budget to retrieve.

    Output:
        models.Budget: The budget if found, otherwise None.
    """
    return db.query(models.Budget).filter(models.Budget.user_id == user_id).first()


def get_user_category(db: Session, user_id: int, category_id: int):
    """
    Retrieves a category for a specific user from the database based on its ID.

    Input:
        db (Session): SQLAlchemy database session.
        user_id (int): Unique identifier of the user.
        category_id (int): Unique identifier of the category to retrieve.

    Output:
        models.Category: The category if found and not deleted, otherwise None.
    """
    return (
        db.query(models.Category)
        .join(models.Budget)
        .filter(
            models.Category.id == category_id,
            models.Budget.user_id == user_id,
            models.Category.budget_id == models.Budget.id,
        )
        .first()
    )


def get_transaction_by_id(db: Session, transaction_id: int):
    """
    Retrieves a transaction from the database based on its ID.

    Input:
        db (Session): SQLAlchemy database session.
        category_id (int): Unique identifier of the transaction to retrieve.

    Output:
        models.Transaction: The transaction if found, otherwise None.
    """
    return (
        db.query(models.Transaction)
        .filter(models.Transaction.id == transaction_id)
        .first()
    )


def get_user_transaction(db: Session, user_id: int, transaction_id: int):

    return (
        db.query(models.Transaction)
        .join(models.Category)
        .join(models.Budget)
        .join(models.User)
        .filter(
            models.Transaction.id == transaction_id,
            models.Category.budget_id == models.Budget.id,
            models.Budget.user_id == user_id,
            models.Transaction.deleted_at.is_(None),
        )
        .first()
    )


def check_existence(obj, custom_message: str = None, expect_existence: bool = False):
    if expect_existence and obj:
        detail_message = (
            custom_message if custom_message else f"{type(obj).__name__} already exists"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail_message,
        )
    elif not expect_existence and not obj:
        detail_message = (
            custom_message if custom_message else f"{type(obj).__name__} not found"
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail_message,
        )


def check_deleted(obj):
    if hasattr(obj, "deleted_at") and obj.deleted_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{type(obj).__name__} is deleted",
        )


def check_ownership(obj, current_user_id: int):
    if hasattr(obj, "budget") and obj.budget.owner.id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized",
        )
