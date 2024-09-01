#---------------firebase_credentials.py---------------
import os
import firebase_admin
from firebase_admin import credentials

# Get the path to the service account JSON file from an environment variable
SERVICE_ACCOUNT_FILE = os.environ.get('FIREBASE_SERVICE_ACCOUNT_FILE')
print("FIREBASE_SERVICE_ACCOUNT_FILE value:", SERVICE_ACCOUNT_FILE)

# Initialize Firebase Admin SDK with service account credentials
if SERVICE_ACCOUNT_FILE:
    # Initialize Firebase Admin SDK with service account credentials
    cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
    firebase_admin.initialize_app(cred)
    # Firebase Firestore database
    db = firebase_admin.firestore.client()
else:
    raise ValueError("Service account file path is not provided.")