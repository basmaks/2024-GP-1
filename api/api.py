#-----------api.py-----------

import os
import json
from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

# Get Firebase credentials from environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')

if cred_json:
    cred = credentials.Certificate(cred_json)  # Use the environment variable path
    firebase_admin.initialize_app(cred)
else:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set.")

db = firestore.client()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the API", 200

@app.route('/api/getRecentUsage', methods=['GET'])
def get_recent_usage():
    # Query the Firestore database to get the most recent usage data
    docs = db.collection('electricity_usage').order_by('timestamp', direction=firebase_admin.firestore.Query.DESCENDING).limit(1).stream()
    usage_data = [doc.to_dict() for doc in docs]

    if usage_data:
        return jsonify(usage_data), 200
    else:
        return jsonify({"message": "No data found"}), 404

if __name__ == '__main__':
    app.run()

    