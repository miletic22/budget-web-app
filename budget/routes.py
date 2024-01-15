from flask import Blueprint, render_template, request, flash

views = Blueprint('views', __name__)

@views.route('/')
@views.route('/home')
def home_page():
    return render_template('index.html')

@views.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

@views.route('/logout')
def logout():
    return render_template('index.html')


@views.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        print(email, username, password1, password2)
        
        if len(email) < 4:
            flash('Invalid email: must be longer than 4 characters.', category='error')
            
        elif len(username) < 2: 
            flash('Invalid username: must be longer than 2 characters.', category='error')
            
        elif password1 != password2:
            flash('Passwords do not match.', category='error')

        elif len(password1) < 7:
            flash('Invalid password: must be longer than 7 characters.', category='error')

        else:
            flash('Account created.', category='success')

        
    return render_template('register.html')
