#-----------background_task.py-----------

import os
import json
import pyemvue
from pyemvue.enums import Scale, Unit
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import credentials, firestore
import time
import queue
import threading
from config import EMVUE_EMAIL, EMVUE_PASSWORD

# Load credentials from environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')
if cred_json:
    cred = credentials.Certificate(json.loads(cred_json))
    firebase_admin.initialize_app(cred)
else:
    raise ValueError("Service account JSON is not provided.")

db = firestore.client()
data_queue = queue.Queue()

# Fetch energy usage data and add it to the queue
def fetch_energy_usage():
    vue = pyemvue.PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)
    devices = vue.get_devices()

    while True:
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

            # Add data to the queue
            data_queue.put(usage_data)

            # Debugging: print fetched data
            print(f"Data fetched and added to queue at {timestamp}: {usage_data}")
        
        time.sleep(1)  # Collect data every second

# Process the queue and commit data to Firestore in small batches
def process_queue():
    while True:
        time.sleep(60)  # Process the queue every 60 seconds (1 minute)

        batch = db.batch()
        count = 0
        max_batch_size = 500  # Firestore allows a maximum of 500 writes per batch
        
        # Debugging: Check how many documents are in the queue before processing
        print(f"Processing queue. Queue size: {data_queue.qsize()} documents.")

        while not data_queue.empty() and count < max_batch_size:
            usage_data = data_queue.get()
            doc_ref = db.collection('electricity_usage').document()  # Auto-generate document ID
            batch.set(doc_ref, usage_data)
            count += 1

        # Commit the batch to Firestore
        if count > 0:
            batch.commit()
            print(f"Batch of {count} documents committed to Firestore.")

if __name__ == '__main__':
    # Start the fetch_energy_usage function in a thread
    data_thread = threading.Thread(target=fetch_energy_usage)
    data_thread.daemon = True
    data_thread.start()

    # Start the process_queue function to write data every 60 seconds
    process_queue()