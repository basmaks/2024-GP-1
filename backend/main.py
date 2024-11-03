# main.py

import os
from fastapi import FastAPI, HTTPException
from firebase_admin import credentials, firestore, initialize_app
import pytz
import threading
from google.cloud import firestore
from google.oauth2 import service_account
from backend.routers import data, outlets, goals
from backend.firebase import db
from backend.utils import format_date_in_arabic
from backend.utils import arabic_days, arabic_months
from backend.config import EMVUE_EMAIL, EMVUE_PASSWORD  

# Initialize FastAPI app
app = FastAPI()

# Include routers
app.include_router(data.router, prefix="/api/v1/data", tags=["data"])
app.include_router(outlets.router, prefix="/api/v1/outlets", tags=["outlets"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])

# Set your local timezone (for Riyadh, use UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

# Global variables for threading
lock = threading.Lock()
inserted_timestamps = set()
last_timestamp = None
previous_usage_data = None

# Background Task to Fetch Energy Usage
def fetch_energy_usage():
    global last_timestamp, previous_usage_data
    from pyemvue import PyEmVue
    from pyemvue.enums import Scale, Unit
    import pytz, os, time
    from datetime import datetime, timedelta

    vue = PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)  
    devices = vue.get_devices()

    while True:
        start_time = time.time()
        for device in devices:
            usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
            channels_data = usage[device.device_gid].channels
            total_channels_usage_kWh = sum(channel.usage if channel.usage is not None else 0 for channel in channels_data.values())
            timestamp = datetime.now(pytz.timezone('Asia/Riyadh')).replace(microsecond=0)

            with lock:
                if last_timestamp and (timestamp - last_timestamp).total_seconds() > 1:
                    missing_time = last_timestamp
                    while (timestamp - missing_time).total_seconds() > 1:
                        missing_time = missing_time + timedelta(seconds=1)
                        if missing_time not in inserted_timestamps:
                            avg_usage_data = previous_usage_data.copy() if previous_usage_data else {
                                'total_channels_usage_kWh': 0,
                                'channels': {channel_num: {'name': channel.name, 'usage': 0} for channel_num, channel in channels_data.items()}
                            } 

                            missing_data = {
                                'total_channels_usage_kWh': avg_usage_data['total_channels_usage_kWh'],
                                'userId': device.device_gid,
                                'timestamp': missing_time,
                                'device_name': usage[device.device_gid].device_name,
                                'channels': avg_usage_data['channels'],
                            }

                            db.collection('electricity_usage').add(missing_data)
                            inserted_timestamps.add(missing_time)

                if timestamp in inserted_timestamps:
                    continue

                valid_channel_usages = [channel.usage for channel in channels_data.values() if channel.usage >= 0]
                avg_usage = sum(valid_channel_usages) / len(valid_channel_usages) if valid_channel_usages else 0

                for channel_num, channel_data in channels_data.items():
                    if channel_data.usage < 0:
                        channels_data[channel_num].usage = avg_usage

                last_timestamp = timestamp
                previous_usage_data = {
                    'total_channels_usage_kWh': total_channels_usage_kWh,
                    'channels': {channel_num: {'name': channel.name, 'usage': channel.usage} for channel_num, channel in channels_data.items()}
                }

                usage_data = {
                    'total_channels_usage_kWh': total_channels_usage_kWh,
                    'userId': device.device_gid,
                    'timestamp': timestamp,
                    'device_name': usage[device.device_gid].device_name,
                    'channels': previous_usage_data['channels'],
                }

                db.collection('electricity_usage').add(usage_data)
                inserted_timestamps.add(timestamp)

        fetch_duration = time.time() - start_time
        if fetch_duration < 1:
            time.sleep(1 - fetch_duration)

@app.get("/test")
async def test_route():
    return {"message": "FastAPI is working"}

@app.get("/test_firestore")
async def test_firestore():
    try:
        # Attempt to retrieve documents from a test collection
        test_ref = db.collection("goals").limit(1).stream()
        test_data = [doc.to_dict() for doc in test_ref]
        
        if not test_data:
            return {"message": "No documents found in 'goals' collection"}
        
        return {"message": "Firestore connection successful", "data": test_data}
    except Exception as e:
        return {"error": str(e)}


# Start background tasks on startup
@app.on_event("startup")
async def start_background_tasks():
    threading.Thread(target=fetch_energy_usage, daemon=True).start()