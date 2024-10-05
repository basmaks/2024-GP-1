
# main.py

import os
from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
import calendar
import pytz
import time
import threading
from pytz import timezone
from pyemvue import PyEmVue
from pyemvue.enums import Scale, Unit
from pycognito.exceptions import TokenVerificationException
from fastapi.responses import JSONResponse

# Initialize FastAPI app
app = FastAPI()

# Set your local timezone (for Riyadh, use UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

# Get Firebase credentials from the environment variable
cred_json = os.environ.get('FIREBASE_CREDENTIALS')

if cred_json:
    cred = credentials.Certificate(cred_json)
    firebase_admin.initialize_app(cred)  # Initialize Firebase only once
else:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set.")

# Get Firestore database reference
db = firestore.client()

lock = threading.Lock()
inserted_timestamps = set()
last_timestamp = None
previous_usage_data = None

# ---------------------------------------------
# Goals Routes
# ---------------------------------------------

# Helper function to get the last day of the current month at 11:59:59 PM local time
def get_last_day_of_month():
    now = datetime.now(local_tz)  # Get the current time in local timezone
    last_day = calendar.monthrange(now.year, now.month)[1]
    # Set the last day of the month to 11:59:59 PM in local timezone
    end_of_month = datetime(now.year, now.month, last_day, 23, 59, 59)
    return local_tz.localize(end_of_month)  # Ensure the datetime is localized

# Pydantic model to validate incoming request for adding/editing goals
class GoalRequest(BaseModel):
    userId: str
    goalAmount: float

# Route to add a goal to the 'goals' collection
@app.post("/goals")
async def add_goal(goal_request: GoalRequest):
    try:
        if not (1 <= goal_request.goalAmount <= 10000):
            raise HTTPException(status_code=400, detail="Goal amount must be between 1 and 10,000 SAR")
        
        # Get the last day of the month
        end_date = get_last_day_of_month()
        
        # Prepare goal data
        goal_data = {
            "userId": goal_request.userId,
            "goalAmount": goal_request.goalAmount,
            "startDate": datetime.now(local_tz),  # Set start date with local timezone
            "endDate": end_date,
            "status": "Active"
        }
        
        # Add the goal to the 'goals' collection in Firestore
        goals_ref = db.collection("goals")
        goals_ref.add(goal_data)  # Auto-generates goalId
        
        return {"message": "Goal added successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to GET (ADD) the active goal for a specific user
@app.get("/goals/{userId}")
async def get_goal(userId: str):
    try:
        goals_ref = db.collection("goals").where("userId", "==", userId).where("status", "==", "Active").limit(1)
        goal = goals_ref.stream()

        goal_data = None
        for g in goal:
            goal_data = g.to_dict()

        if not goal_data:
            raise HTTPException(status_code=404, detail="No active goal found")

        return goal_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to DELETE a goal for a user
@app.delete("/goals/{userId}")
async def delete_goal(userId: str):
    try:
        goals_ref = db.collection("goals").where("userId", "==", userId).where("status", "==", "Active").limit(1)
        goal = goals_ref.stream()

        goal_id = None
        for g in goal:
            goal_id = g.id

        if not goal_id:
            raise HTTPException(status_code=404, detail="No active goal found")

        # Delete the goal
        db.collection("goals").document(goal_id).delete()
        
        return {"message": "Goal deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to EDIT a goal for a user
@app.put("/goals/{userId}")
async def edit_goal(userId: str, goal_request: GoalRequest):
    try:
        if not (1 <= goal_request.goalAmount <= 10000):
            raise HTTPException(status_code=400, detail="Goal amount must be between 1 and 10,000 SAR")
        
        goals_ref = db.collection("goals").where("userId", "==", userId).where("status", "==", "Active").limit(1)
        goal = goals_ref.stream()

        goal_id = None
        for g in goal:
            goal_id = g.id

        if not goal_id:
            raise HTTPException(status_code=404, detail="No active goal found")

        # Update the goal
        db.collection("goals").document(goal_id).update({
            "goalAmount": goal_request.goalAmount,
        })

        return {"message": "Goal updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------
# Data Routes
# ---------------------------------------------

@app.get("/data/byDay")
async def get_daily_total_consumption(user_id: str):
    specific_date = datetime(2024, 9, 25).date()  # For testing purposes
    total_consumption = 0

    # Fetch documents for the user from Firestore
    docs = db.collection('electricity_usage').where('userId', '==', user_id).stream()

    for doc in docs:
        data = doc.to_dict()
        timestamp_str = data.get('timestamp')
        print(f"Document fetched: {data}")  # Log the entire document

        try:
            timestamp = datetime.strptime(timestamp_str, "%B %d, %Y at %I:%M:%S %p UTC%z")
            print(f"Parsed timestamp: {timestamp}")
        except ValueError:
            print(f"Error parsing timestamp: {timestamp_str}")
            continue

        if timestamp.date() == specific_date:
            total_consumption += data.get('total_channels_usage_kWh', 0)
            print(f"Accumulated total consumption: {total_consumption}")

    return {"total_daily_consumption_kWh": total_consumption}

@app.get("/data/bySecond")
async def get_recent_usage():
    docs = db.collection('electricity_usage').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1).stream()
    usage_data = [doc.to_dict() for doc in docs]

    if usage_data:
        return {"status": "success", "data": usage_data}
    else:
        return {"status": "error", "message": "No data found"}

# ---------------------------------------------
# Background Task to Fetch Energy Usage
# ---------------------------------------------

def fetch_energy_usage():
    global last_timestamp, previous_usage_data
    vue = PyEmVue()
    vue.login(username=os.environ.get("EMVUE_EMAIL"), password=os.environ.get("EMVUE_PASSWORD"))
    devices = vue.get_devices()

    while True:
        start_time = time.time()
        for device in devices:
            usage = vue.get_device_list_usage(deviceGids=[device.device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
            channels_data = usage[device.device_gid].channels
            total_channels_usage_kWh = sum(channel.usage for channel in channels_data.values())
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

# ---------------------------------------------
# Outlets Routes
# ---------------------------------------------

# Local timezone (for Riyadh, UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

@app.get("/outlets/byDay")
async def get_outlet_consumption_by_day(user_id: str, date: Optional[str] = None):
    # If no date is provided, default to today's date
    if date:
        specific_date = datetime.strptime(date, "%Y-%m-%d").date()
    else:
        specific_date = datetime.now(local_tz).date()

    outlet_consumption = {}  # To store daily consumption for each outlet

    # Fetch documents for the user from Firestore
    docs = db.collection('electricity_usage').where('userId', '==', user_id).stream()

    print(f"Fetched documents for user {user_id} on date {specific_date}")  # Debugging

    for doc in docs:
        data = doc.to_dict()
        print(f"Fetched document: {data}")  # Log full document for inspection

        # Check if channels exist in the document
        if 'channels' not in data:
            print(f"Document missing channels: {data}")
            continue  # Skip this document if key fields are missing

        timestamp_str = data.get('timestamp')
        print(f"Document timestamp string: {timestamp_str}")  # Debugging

        try:
            # Parse the timestamp
            timestamp = datetime.strptime(timestamp_str, "%B %d, %Y at %I:%M:%S %p UTC%z")
            print(f"Parsed timestamp: {timestamp.date()} vs Specific Date: {specific_date}")

            # Compare document date with specific date
            if timestamp.date() == specific_date:
                print(f"Document matches date: {specific_date}")
            else:
                print(f"Document does NOT match date: {timestamp.date()} != {specific_date}")
                continue  # Skip if date doesn't match

        except ValueError:
            print(f"Error parsing timestamp: {timestamp_str}")
            continue  # Skip this document if timestamp parsing fails

        # Process the matching documents for the requested date
        print(f"Processing document for date: {specific_date}")

        # Process each channel inside the 'channels' map
        channels = data.get('channels', {})
        print(f"Channels data: {channels}")  # Log channels map for debugging

        for channel_id, channel_data in channels.items():
            usage = channel_data.get('usage', 0)
            print(f"Channel {channel_id} has usage: {usage}")  # Debugging the usage per channel
            # Accumulate the daily usage for each channel
            outlet_consumption[channel_id] = outlet_consumption.get(channel_id, 0) + usage

    if outlet_consumption:
        print(f"Outlet consumption data: {outlet_consumption}")  # Debugging
    else:
        print("No outlet consumption data found")  # Debugging

    return {
        "outlet_consumption": outlet_consumption
    }

# ---------------------------------------------

# Run background task to fetch energy usage
@app.on_event("startup")
async def start_background_tasks():
    pass  # Placeholder, no operation
# threading.Thread(target=fetch_energy_usage, daemon=True).start()