from flask import Flask, render_template, redirect, url_for

app = Flask(__name__, static_folder="static")
# issues of linking css file.
# STATIC_DIR = os.path.abspath('/static')

@app.route("/")
def homepage():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
