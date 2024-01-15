from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()
DB_NAME = 'budget-tracker.db'

def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config['SECRET_KEY'] = "8yYP'M'm6)eZ/^X)S0dN}<}Q^An00Z"
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    db.init_app(app)
    
    from .routes import views
    
    app.register_blueprint(views, url_prefix='/')
    
    from .models import User, UserBudget, BudgetCategory, CategoryTransactions
    
    create_database(app)
    
    return app

def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()
        print('Created Database!')
