#---------------background_task.py---------------

import pyemvue
from pyemvue.enums import Scale, Unit
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime
import time
from config import EMVUE_EMAIL, EMVUE_PASSWORD  

# Initialize Firestore DB
cred = credentials.Certificate(os.environ.get('FIREBASE_SERVICE_ACCOUNT_FILE'))
firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_energy_usage():
    # Initialize Emporia Energy Vue object
    vue = pyemvue.PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)

    # Get list of devices
    devices = vue.get_devices()

    # Gather usage data for all devices
    for device in devices:
        usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
        
        # Prepare usage data for Firestore
        timestamp = datetime.now()
        userId = device.device_gid
        
        channels_data = {}
        total_usage_kWh = 0
        for channel_num, channel in usage[device.device_gid].channels.items():
            channels_data[channel_num] = channel.usage
            total_usage_kWh += channel.usage
        
        usage_data = {
            'userId': userId,
            'timestamp': timestamp,
            'channels': channels_data,
            'total_usage_kWh': total_usage_kWh
        }
        
        # Save to Firestore
        db.collection('electricity_usage').add(usage_data)

def run_background_task():
    while True:
        fetch_energy_usage()
        # Run the task every minute
        time.sleep(60)

if __name__ == '__main__':
    run_background_task()
