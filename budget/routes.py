from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User, Budget, Category, Transaction
from flask_login import login_user, login_required, logout_user, current_user
import uuid
from . import db
from sqlalchemy.sql import func

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home_page():
    if request.method == 'POST':
        transaction = request.form.get('transaction')
    return render_template('index.html', user=current_user)


@views.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        form_type = request.form.get('form_type')

        if form_type == 'budget-update':
            budget_amount_str = request.form.get('budget_amount')
            
            try:
                # Try to convert the input to a numerical value
                budget_amount = int(budget_amount_str)
            except ValueError:
                # If conversion fails, display an error message
                flash('Budget amount has to be a numerical value', category='error')
                return render_template('settings.html', user=current_user)

            user_budget = Budget.query.filter_by(user_id=current_user.id).first()
            if user_budget:
                user_budget.amount = budget_amount
                user_budget.updated_at = func.now()
                db.session.commit()
            else:
                new_budget = Budget(created_at=func.now(),
                                    updated_at = func.now(),
                                    amount=budget_amount,
                                    user_id=current_user.id)
                db.session.add(new_budget)
                db.session.commit()
            
            flash('Budget updated.', category='success')

    return render_template('settings.html', user=current_user)


@views.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        identifier = request.form.get('identifier')
        password = request.form.get('password')

        # Check if the identifier is an email or a username
        user = User.query.filter(
            (User.email == identifier) | (User.username == identifier)
        ).first()

        print(user)
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.home_page'))
            else:
                flash('Incorrect password, try aga in.', category='error')
        else:
            flash('Email or username does not exist.', category='error')

    return render_template('login.html', user=current_user)

@views.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Logged out succesfully", category='success')
    return redirect(url_for('views.login'))


@views.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        user = User.query.filter_by(email=email).first()
        
        if user:
            flash("User already exists", category='error')
        elif len(email) < 4:
            flash('Invalid email: must be longer than 4 characters.', category='error')
        elif len(username) < 2: 
            flash('Invalid username: must be longer than 2 characters.', category='error')
        elif password1 != password2:
            flash('Passwords do not match.', category='error')
        elif len(password1) < 7:
            flash('Invalid password: must be longer than 7 characters.', category='error')
        else:
            new_user = User(username=username,
                            email=email, 
                            password=generate_password_hash(password1, method='pbkdf2:sha256'))
            db.session.add(new_user)
            db.session.commit()

            flash('Account created.', category='success')       
            login_user(new_user, remember=True)
            return redirect(url_for('views.settings'))
            
    return render_template('register.html', user=current_user)
