from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
	return render_template('home.html')


if __name__ == '__main__':
	# debug=True : no need to restart the server every single time
	app.run(debug=True)