#---------------firebase_credentials.py---------------

import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase credentials from environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')
if cred_json:
    cred = credentials.Certificate(json.loads(cred_json))
    firebase_admin.initialize_app(cred)
    db = firebase_admin.firestore.client()
else:
    raise ValueError("Service account JSON is not provided.")
