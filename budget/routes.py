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
        transaction_id = request.form.get('transaction_id')
        transaction = Transaction.query.filter_by(id = transaction_id).first()
        transaction.deleted_at = func.now()
        db.session.commit()
                        
        flash('Transaction deleted.', category='success')
        
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
            user_budget.amount = budget_amount
            user_budget.updated_at = func.now()
            db.session.commit()
                        
            flash('Budget updated.', category='success')
        
        if form_type == 'categories-update':
            form_data = request.form
            categories_data = []

            # Iterate through form data and extract category names, amounts, and reference numbers
            for key, value in form_data.items():
                if key.startswith('category_') and key.endswith('_name'):
                    category_number = key.split('_')[1]
                    category_name = value
                    category_amount = form_data.get(f'category_{category_number}_amount', '')
                    reference_number = int(category_number)

                    categories_data.append({
                        'reference_number': reference_number,
                        'name': category_name,
                        'amount': category_amount
                    })
            for category_data in categories_data:
                category = Category.query.filter_by(
                    budget_id = current_user.budget.id,
                    reference_number=category_data['reference_number']
                ).first()

                category.updated_at = func.now()
                category.name = category_data['name']
                category.amount = category_data['amount']                

            db.session.commit()  # Commit changes to the database
            flash('Categories updated.', category='success')
        
        if form_type == 'user-delete':
            user_id = request.form.get("user_id")
            current_user.deleted_at = func.now()
            
            # Soft delete the user's budget
            if current_user.budget:
                current_user.budget.deleted_at = func.now()

                # Soft delete the budget's categories
                for category in current_user.budget.categories:
                    category.deleted_at = func.now()

                    # Soft delete the category's transactions
                    for transaction in category.transactions:
                        transaction.deleted_at = func.now()
                        
            db.session.commit()
            logout()
            flash("You had deleted your account successfully", category='success')
            return redirect(url_for('views.login'))


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
        if user and not user.deleted_at:
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
            
            new_budget = Budget(created_at = func.now(),
                                updated_at = func.now(),
                                amount=0,
                                user_id=current_user.id)
            db.session.add(new_budget)
            db.session.commit()
            for reference_number in range(1, 6):
                category = Category(
                    created_at=func.now(),
                    updated_at=func.now(),
                    reference_number=reference_number,
                    name=f'Category {reference_number}',
                    amount=0,
                    budget_id=current_user.budget.id
                )
                db.session.add(category)
            db.session.commit()

            
            return redirect(url_for('views.home_page'))
            
    return render_template('register.html', user=current_user)


@views.route('/transaction', methods=["GET", "POST"])
def transaction():
    print(request.form)
    if request.method == "POST":
        category_name = request.form.get('selected_category')
        amount = request.form.get('amount')
        note = request.form.get('note')
        if not amount.replace('.', '', 1).isdigit():
            flash("Amount has to be a numeric value", category='error')
        
        elif not category_name:
            flash("Please select a category", category='error')
        else:
            if note == "":
                note = "N/A"
            category_query = Category.query.join(Budget)
            specific_category = category_query.filter(Budget.user_id == current_user.id, Category.name == category_name).first()
            new_transaction = Transaction(
                created_at = func.now(),
                updated_at = func.now(),
                amount = amount,
                note = note,
                category_id = specific_category.id
            )
            db.session.add(new_transaction)
            db.session.commit()
            flash(f'Added transaction under "{specific_category.name}" Category for ${amount}', category='success')
     
    return render_template('transaction.html', user = current_user)