# utils.py

from . import models
from passlib.context import CryptContext
from sqlalchemy.orm import Session
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


def reactivate_soft_deleted_budget(db: Session, user_id: int, budget_data: dict) -> models.Budget:
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
        models.Budget.user_id == user_id,
        models.Budget.deleted_at.isnot(None)
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

