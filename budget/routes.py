from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db
from flask_login import login_user, login_required, logout_user, current_user

views = Blueprint('views', __name__)

@views.route('/')
@login_required
def home_page():
    return render_template('index.html', user=current_user)

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
        print(email)
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
            new_user = User(email=email, 
                            username=username, 
                            password = generate_password_hash(password1, method='pbkdf2:sha256'),
                            deleted_at = None)
            flash('Account created.', category='success')
            db.session.add(new_user)
            db.session.commit()
            login_user(user, remember=True)
            flash('Account created', category='success')
            
            return redirect(url_for('views.home_page'))
            
    return render_template('register.html', user=current_user)
