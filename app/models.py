from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    TIMESTAMP,
    func,
    text,
    ForeignKey,
)
from flask_sqlalchemy import SQLAlchemy
from .database import Base

db = SQLAlchemy()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    created_at = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    budget = db.relationship("Budget", backref="user", uselist=False)


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True)
    created_at = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    amount = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))

    categories = db.relationship("Category", backref="budget")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    created_at = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    reference_number = Column(Integer)
    name = Column(String)
    amount = Column(Integer)

    budget_id = Column(Integer, ForeignKey("budgets.id"))
    transactions = db.relationship("Transaction", backref="category")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    created_at = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    amount = Column(Integer)
    note = Column(String(120))

    category_id = Column(Integer, ForeignKey("categories.id"))