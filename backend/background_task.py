import os
import json
from pyemvue import PyEmVue  # Correct import for PyEmVue
from pyemvue.enums import Scale, Unit
from datetime import datetime, timedelta
import pytz
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
import time
import queue
import threading
from config import EMVUE_EMAIL, EMVUE_PASSWORD  # Import credentials from config.py
from threading import Lock
from pycognito.exceptions import TokenVerificationException

# Get Firebase credentials from environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')

if cred_json:
    cred = credentials.Certificate(cred_json)  # Use the path from the environment variable
    firebase_admin.initialize_app(cred)
else:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set.")

db = firestore.client()
data_queue = queue.Queue()
lock = Lock()  # Lock to prevent concurrent write conflicts
last_timestamp = None  # Store last timestamp for the device
previous_usage_data = None  # Store previous valid usage data for averaging

# Set to keep track of inserted timestamps
inserted_timestamps = set()

# Function to retry login in case of failure
def login_with_retry(vue, retries=3, delay=30):
    for attempt in range(retries):
        try:
            vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)  # Use credentials from config.py
            print("Login successful!")
            return
        except TokenVerificationException as e:
            print(f"Login attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                raise Exception("All retry attempts failed")

# Fetch energy usage data and add it to the queue
def fetch_energy_usage():
    global last_timestamp, previous_usage_data  # Declare last_timestamp and previous_usage_data as global inside the function

    vue = PyEmVue()
    login_with_retry(vue)  # Retry login on failure
    
    # Delay after login to allow the token to become valid
    time.sleep(10)
    
    devices = vue.get_devices()

    while True:
        start_time = time.time()  # Measure fetch duration

        for device in devices:
            usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
            channels_data = usage[device.device_gid].channels

            # Handle NoneType by replacing it with 0
            total_channels_usage_kWh = sum(channel.usage if channel.usage is not None else 0 for channel in channels_data.values())

            # Strip off milliseconds and only use seconds
            timestamp = datetime.now(pytz.timezone('Asia/Riyadh')).replace(microsecond=0)

            # Lock to avoid race condition
            with lock:
                # Replace negative values or None with average or zero
                valid_channel_usages = [channel.usage for channel in channels_data.values() if channel.usage is not None and channel.usage >= 0]

                if valid_channel_usages:
                    avg_usage = sum(valid_channel_usages) / len(valid_channel_usages)
                else:
                    avg_usage = 0  # If all are None or negative, use 0

                for channel_num, channel_data in channels_data.items():
                    if channel_data.usage is None or channel_data.usage < 0:
                        channels_data[channel_num].usage = avg_usage

                # Update the last_timestamp and save current usage as the previous valid one
                last_timestamp = timestamp
                previous_usage_data = {
                    'total_channels_usage_kWh': total_channels_usage_kWh,
                    'channels': {channel_num: {'name': channel.name, 'usage': channel.usage} for channel_num, channel in channels_data.items()}
                }

                # Prepare actual usage data
                usage_data = {
                    'total_channels_usage_kWh': total_channels_usage_kWh,
                    'userId': device.device_gid,
                    'timestamp': timestamp,
                    'device_name': usage[device.device_gid].device_name,
                    'channels': previous_usage_data['channels'],  # Use current valid usage
                }

                # Add data to the queue
                data_queue.put(usage_data)
                inserted_timestamps.add(timestamp)

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