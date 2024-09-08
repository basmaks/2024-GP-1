import os
import json
from flask import Flask, jsonify
from flask_cors import CORS
import pyemvue
from pyemvue.enums import Scale, Unit
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
import time  # Add this for the delay between requests
from config import EMVUE_EMAIL, EMVUE_PASSWORD

# Load credentials from environment variable
cred_json = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
if cred_json:
    cred = credentials.Certificate(json.loads(cred_json))
else:
    raise ValueError("No GOOGLE_APPLICATION_CREDENTIALS environment variable set")

initialize_app(cred)

db = firestore.client()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

def fetch_energy_usage():
    vue = pyemvue.PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)
    devices = vue.get_devices()

    for device in devices:
        usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
        channels_data = usage[device.device_gid].channels
        total_channels_usage_kWh = sum(channel.usage for channel in channels_data.values())
        
        timestamp = datetime.now(pytz.timezone('Asia/Riyadh'))
        usage_data = {
            'total_channels_usage_kWh': total_channels_usage_kWh,
            'userId': device.device_gid,
            'timestamp': timestamp,
            'device_name': usage[device.device_gid].device_name,
            'channels': {channel_num: {'name': channel.name, 'usage': channel.usage} for channel_num, channel in channels_data.items()},
        }

        # Save to Firestore
        db.collection('electricity_usage').add(usage_data)

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the API", 200

if __name__ == '__main__':
    # Infinite loop to run automatically
    while True:
        fetch_energy_usage()
        time.sleep(1)  # Wait for 60 seconds before fetching data again