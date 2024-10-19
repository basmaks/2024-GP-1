# firebase.py

import os
from google.oauth2 import service_account
from google.cloud import firestore

# Get Firebase credentials from the environment variable
cred_json_path = os.environ.get('FIREBASE_CREDENTIALS')

if cred_json_path and os.path.exists(cred_json_path):
    # Load credentials from the specified JSON file
    credentials = service_account.Credentials.from_service_account_file(cred_json_path)
    
    # Initialize Firestore client with the loaded credentials
    db = firestore.Client(credentials=credentials)
else:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set or the path is invalid.")