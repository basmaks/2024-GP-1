#---------------api.py---------------

# 1. Make sure to replace with the actual path to your JSON file.

# 3. Run this in terminal: python3 api.py or python api.py (depends on python version).

# Must download pyemvue library first. Use this command: pip install Flask or pip3 install Flask (depends on python version).

# API ENDPOINT: http://127.0.0.1:5000/api/getRecentUsage (IP address may vary based on computer / device)

# Imports 
from flask import Flask, jsonify
from flask_cors import CORS
import pyemvue
from pyemvue.enums import Scale, Unit
import os
import json
from datetime import datetime
import pytz

# Credentials and Configurations 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from config import EMVUE_EMAIL, EMVUE_PASSWORD

# Replace with the actual path to your JSON file
service_account_file_path = "/Users/basmaalsulaim/Desktop/GP/FIREBASE_CREDENTIALS/murshid-f076f-firebase-adminsdk-7lhjc-44d33f50b0.json" # REPLACE WITH YOUR OWN PATH
os.environ['FIREBASE_SERVICE_ACCOUNT_FILE'] = service_account_file_path

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firestore DB globally
service_account_file = os.environ.get('FIREBASE_SERVICE_ACCOUNT_FILE')
if service_account_file:
    cred = credentials.Certificate(service_account_file)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    raise ValueError("Service account file path is not provided.")

def fetch_energy_usage():
    # Initialize Emporia Energy Vue object
    vue = pyemvue.PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)

    # Get list of devices
    devices = vue.get_devices()

    # Gather usage data for all devices
    device_usage_data = {}
    for device in devices:
        usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
        channels_data = usage[device.device_gid].channels
        channel_usage = {channel_num: {'name': channel.name, 'usage': channel.usage} for channel_num, channel in channels_data.items()}

        # Calculate total usage from all channels
        total_channels_usage_kWh = sum(channel.usage for channel in channels_data.values())

        device_usage_data[device.device_gid] = {
            'device_name': usage[device.device_gid].device_name,
            'channels': channel_usage,
            'total_channels_usage_kWh': total_channels_usage_kWh  # Aggregates total usage from all channels 
        }

        # Prepare data for Firestore
        timestamp = datetime.now(pytz.timezone('Asia/Riyadh'))
        userId = device.device_gid
        usage_data = {
            'total_channels_usage_kWh': total_channels_usage_kWh, 
            'userId': userId,  
            'timestamp': timestamp,
            'device_name': usage[device.device_gid].device_name,
            'channels': channel_usage,
        }
        
        # Save to Firestore
        db.collection('electricity_usage').add(usage_data)
        
    return device_usage_data

@app.route('/api/getRecentUsage', methods=['GET'])
def get_recent_usage():
    try:
        device_usage_data = fetch_energy_usage()
        return jsonify(device_usage_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)