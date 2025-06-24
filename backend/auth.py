# import os

# import bcrypt
# from dotenv import load_dotenv
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from pymongo import MongoClient

# load_dotenv()
# app = Flask(__name__)
# CORS(app)

# client = MongoClient(os.getenv("MONGO_URI"))
# db = client["auth_db"]
# users = db["users"]

# @app.route("/signup", methods=["POST"])
# def signup():
#     data = request.get_json()
#     if users.find_one({"email": data["email"]}):
#         return jsonify({"message": "Email already exists"}), 400
#     hashed_pw = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt())
#     users.insert_one({
#         "name": data["name"],
#         "email": data["email"],
#         "password": hashed_pw
#     })
#     return jsonify({"message": "User registered successfully"}), 201

# @app.route("/signin", methods=["POST"])
# def signin():
#     data = request.get_json()
#     user = users.find_one({"email": data["email"]})
#     if not user or not bcrypt.checkpw(data['password'].encode(), user['password']):
#         return jsonify({"message": "Invalid email or password"}), 401
#     return jsonify({"message": "Login successful"}), 200

# if __name__ == '__main__':
#     app.run(debug=True)



import datetime
import os

import bcrypt
import jwt as pyjwt
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

load_dotenv()
app = Flask(__name__)
CORS(app)

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")  # Add this to your .env

client = MongoClient(os.getenv("MONGO_URI"))
db = client["auth_db"]
users = db["users"]

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if users.find_one({"email": data["email"]}):
        return jsonify({"message": "Email already exists"}), 400
    hashed_pw = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt())
    users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw
    })
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    user = users.find_one({"email": data["email"]})
    if not user or not bcrypt.checkpw(data['password'].encode(), user['password']):
        return jsonify({"message": "Invalid email or password"}), 401

    token = pyjwt.encode(
        {
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"message": "Login successful", "token": token}), 200

@app.route("/protected", methods=["GET"])
def protected():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Missing token"}), 403
    try:
        pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"message": "Access granted"}), 200
    except pyjwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

if __name__ == '__main__':
    app.run(debug=True)
