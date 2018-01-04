from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import render_template, request, redirect, url_for
from flask.ext.security import Security, SQLAlchemyUserDatastore, \
	UserMixin, RoleMixin, login_required

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:12345@localhost/flask_movies'
app.config['SECRET_KEY'] = 'super-secret'
app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_PASSWORD_SALT'] = 'pepper'
db = SQLAlchemy(app)


# Define models
roles_users = db.Table('roles_users',
	db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
	db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
	)
class Role(db.Model, RoleMixin):
	id = db.Column(db.Integer(), primary_key=True)
	name = db.Column(db.String(80), unique=True)
	description = db.Column(db.String(255))

class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(255), unique=True)
	password = db.Column(db.String(255))
	active = db.Column(db.Boolean())
	confirmed_at = db.Column(db.DateTime())
	roles = db.relationship('Role', secondary=roles_users,
		backref=db.backref('users', lazy='dynamic'))


# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

# Crease a user to test with
# @app.before_first_request
# def create_user():
# 	db.create_all()
# 	user_datastore.create_user(email='tester@gmail.com', password='12345')
# 	db.session.commit()

@app.route('/')
def index():

	return render_template('index.html')

@app.route('/profile/<email>')
@login_required
def profile(email):
	user = User.query.filter_by(email=email).first()

	return render_template('profile.html', user=user)

@app.route('/post_user', methods=['POST'])
def post_user():
	print(request.form['username'])
	print(request.form['email'])
	user = User(request.form['username'], request.form['email'])
	db.session.add(user)
	db.session.commit()

	return redirect(url_for('index'))


if __name__ == '__main__':
	app.run(debug=True)