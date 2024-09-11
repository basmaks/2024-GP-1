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
from threading import Lock

# Load credentials from environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')
if cred_json:
    cred = credentials.Certificate(cred_json)
    firebase_admin.initialize_app(cred)
else:
    raise ValueError("Service account JSON is not provided.")

db = firestore.client()
data_queue = queue.Queue()
lock = Lock()  # Lock to prevent concurrent write conflicts
last_timestamp = None  # Store last timestamp for the device

# Fetch energy usage data and add it to the queue
def fetch_energy_usage():
    global last_timestamp  # Declare last_timestamp as global inside the function

    vue = pyemvue.PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)
    devices = vue.get_devices()

    while True:
        start_time = time.time()  # Measure fetch duration
        
        for device in devices:
            usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
            channels_data = usage[device.device_gid].channels
            total_channels_usage_kWh = sum(channel.usage for channel in channels_data.values())

            # Strip off milliseconds and only use seconds
            timestamp = datetime.now(pytz.timezone('Asia/Riyadh')).replace(microsecond=0)

            # Lock to avoid race condition
            with lock:
                # If the fetched timestamp is the same as the last one, skip this fetch
                if last_timestamp and timestamp == last_timestamp:
                    continue  # Skip duplicate second

                last_timestamp = timestamp  # Update the last fetched second

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
        
        # Measure how long the fetching took
        fetch_duration = time.time() - start_time
        if fetch_duration < 1:
            time.sleep(1 - fetch_duration)  # Adjust the sleep time to keep up with the 1-second interval

# Process the queue and commit data to Firestore in small batches
def process_queue():
    while True:
        time.sleep(10)  # Process the queue more frequently (every 10 seconds)

        batch = db.batch()
        count = 0
        max_batch_size = 500  # Firestore allows a maximum of 500 writes per batch
        
        # Debugging: Check how many documents are in the queue before processing
        print(f"Processing queue. Queue size: {data_queue.qsize()} documents.")

        while not data_queue.empty() and count < max_batch_size:
            usage_data = data_queue.get()

            # Sanity check to ensure no negative or invalid values
            if usage_data['total_channels_usage_kWh'] < 0:
                print(f"Skipping invalid data with negative usage: {usage_data}")
                continue

            # Check individual channels for negative usage
            valid_data = True
            for channel_num, channel_data in usage_data['channels'].items():
                if channel_data['usage'] < 0:
                    print(f"Skipping invalid channel data: {channel_num} with usage {channel_data['usage']}")
                    valid_data = False
                    break
            
            if not valid_data:
                continue  # Skip this record if invalid

            # If data is valid, proceed to commit it
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

    # Start the process_queue function to write data every 10 seconds
    process_queue()