from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True))
    updated_at = db.Column(db.DateTime(timezone=True), nullable=True)
    deleted_at = db.Column(db.DateTime(timezone=True), nullable=True)

    username = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    budget = db.relationship("Budget", backref="user", uselist=False)


class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True))
    updated_at = db.Column(db.DateTime(timezone=True), nullable=True)
    deleted_at = db.Column(db.DateTime(timezone=True), nullable=True)

    amount = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    categories = db.relationship("Category", backref="budget")

    def __repr__(self):
        return f"{self.id} {self.amount} {self.user_id}"


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True))
    updated_at = db.Column(db.DateTime(timezone=True), nullable=True)
    deleted_at = db.Column(db.DateTime(timezone=True), nullable=True)

    reference_number = db.Column(db.Integer)
    name = db.Column(db.String(150))
    amount = db.Column(db.Integer)

    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"))
    transactions = db.relationship("Transaction", backref="category")


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True))
    updated_at = db.Column(db.DateTime(timezone=True), nullable=True)
    deleted_at = db.Column(db.DateTime(timezone=True), nullable=True)

    amount = db.Column(db.Integer)
    note = db.Column(db.String(120))

    category_id = db.Column(db.Integer, db.ForeignKey("category.id"))
