#---------------firebase_credentials.py---------------
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Get the path to the service account JSON file from an environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')
if cred_json:
    cred = credentials.Certificate(json.loads(cred_json))
    firebase_admin.initialize_app(cred)
    db = firebase_admin.firestore.client()
else:
    raise ValueError("Service account file path is not provided.")