from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key = True)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), default=func.now())
    username = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True )
    password = db.Column(db.String(150))
    budget = db.relationship('UserBudget')
    
class UserBudget(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), default=func.now())
    budget_id = db.Column(db.Integer, primary_key=True)
    budget_amount = db.Column(db.Float)
    categories = db.relationship('BudgetCategory', backref='user_budget')

class BudgetCategory(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), default=func.now())
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(150))
    category_amount = db.Column(db.Float)
    transactions = db.relationship('CategoryTransactions', backref='budget_category')

class CategoryTransactions(db.Model):
    category_id = db.Column(db.Integer, db.ForeignKey('budget_category.category_id'), primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), default=func.now())
    amount = db.Column(db.Float)
