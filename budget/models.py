from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True))
    username = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    budgets = db.relationship('UserBudget', backref='user')
    
    def get_id(self):
           return (self.user_id)

class UserBudget(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey('budget_category.budget_id'), primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True))
    budget_amount = db.Column(db.Float)
    category = db.relationship('BudgetCategory', backref='user_budgets', foreign_keys=[budget_id])

class BudgetCategory(db.Model):
    budget_id = db.Column(db.Integer, primary_key=True)  # Adjusted primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user_budget.user_id'))  # Added FK to UserBudget
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True))
    category_id = db.Column(db.Integer, primary_key=True)  # Adjusted primary key
    category_name = db.Column(db.String(150))
    category_amount = db.Column(db.Float)
    transactions = db.relationship('CategoryTransactions', backref='budget_category')

class CategoryTransactions(db.Model):
    category_id = db.Column(db.Integer, db.ForeignKey('budget_category.category_id'), primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True))
    amount = db.Column(db.Float)
