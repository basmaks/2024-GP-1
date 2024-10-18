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
from google.cloud import firestore
from google.oauth2 import service_account
from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds
from dateutil.parser import isoparse

# Initialize FastAPI app
app = FastAPI()

# Set your local timezone (for Riyadh, use UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

# Get Firebase credentials from the environment variable
cred_json_path = os.environ.get('FIREBASE_CREDENTIALS')

if cred_json_path and os.path.exists(cred_json_path):
    # Load credentials from the specified JSON file
    credentials = service_account.Credentials.from_service_account_file(cred_json_path)
    
    # Initialize Firestore client with the loaded credentials
    db = firestore.Client(credentials=credentials)
else:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set or the path is invalid.")

lock = threading.Lock()
inserted_timestamps = set()
last_timestamp = None
previous_usage_data = None

# Dictionary for Arabic day and month names
arabic_days = {
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
    'Friday': 'الجمعة',
    'Saturday': 'السبت',
    'Sunday': 'الأحد'
}

arabic_months = {
    'January': 'يناير',
    'February': 'فبراير',
    'March': 'مارس',
    'April': 'أبريل',
    'May': 'مايو',
    'June': 'يونيو',
    'July': 'يوليو',
    'August': 'أغسطس',
    'September': 'سبتمبر',
    'October': 'أكتوبر',
    'November': 'نوفمبر',
    'December': 'ديسمبر'
}

def format_date_in_arabic(date_obj):
    day_name = date_obj.strftime('%A')
    day = date_obj.strftime('%d')
    month_name = date_obj.strftime('%B')
    year = date_obj.strftime('%Y')

    # Translate to Arabic
    return f"{arabic_days[day_name]}, {day} {arabic_months[month_name]} {year}"

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

# By SECOND
@app.get("/data/bySecond")
async def get_recent_usage():
    docs = db.collection('electricity_usage').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1).stream()
    usage_data = [doc.to_dict() for doc in docs]

    if usage_data:
        return {"status": "success", "data": usage_data}
    else:
        return {"status": "error", "message": "No data found"}
    
# By HOUR
from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds

@app.get("/data/byHour")
async def get_hourly_consumption(date: Optional[str] = None):
    try:
        # If no date is provided, default to today's date
        if date:
            specific_date = datetime.strptime(date, "%Y-%m-%d").date()
        else:
            specific_date = datetime.now(local_tz).date()

        hourly_consumption = [0] * 24  # To store hourly consumption for 24 hours

        # Convert specific date to the start and end times in UTC
        start_of_day_local = datetime.combine(specific_date, datetime.min.time())
        end_of_day_local = datetime.combine(specific_date, datetime.max.time())

        # Localize to Riyadh timezone and convert to UTC
        start_of_day_utc = local_tz.localize(start_of_day_local).astimezone(pytz.utc)
        end_of_day_utc = local_tz.localize(end_of_day_local).astimezone(pytz.utc)

        # Fetch documents from 'electricity_usage' collection for the specified date
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_day_utc)\
            .where('timestamp', '<=', end_of_day_utc)\
            .stream()

        for doc in docs:
            data = doc.to_dict()
            timestamp = data.get('timestamp')

            if isinstance(timestamp, DatetimeWithNanoseconds):
                # Convert Firestore timestamp to Python datetime
                timestamp_dt = timestamp.replace(tzinfo=pytz.UTC)
                timestamp_local = timestamp_dt.astimezone(local_tz)

                # Check if the document falls on the specific date
                if timestamp_local.date() == specific_date:
                    hour = timestamp_local.hour
                    hourly_consumption[hour] += data.get('total_channels_usage_kWh', 0)

        return {
            "hourly_consumption": hourly_consumption
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# By DAY
@app.get("/data/byDay")
async def get_daily_consumption_and_cost():
    try:
        # Get the current date (today) in the local timezone (Riyadh)
        today = datetime.now(local_tz)
        
        # Define the start and end of the current day in the local timezone (Riyadh)
        start_of_day_local = today.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day_local = today.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Print the local query range for debugging
        print(f"Querying from {start_of_day_local} to {end_of_day_local}")

        total_daily_consumption = 0

        # Fetch documents from 'electricity_usage' collection for the current day in the local timezone (Riyadh)
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_day_local)\
            .where('timestamp', '<=', end_of_day_local)\
            .stream()

        # Log the number of documents fetched
        for doc in docs:
            data = doc.to_dict()
            total_channels_usage = data.get('total_channels_usage_kWh')

            # Sum the available total_channels_usage_kWh for each document
            if total_channels_usage is not None:
                total_daily_consumption += total_channels_usage

        print(f"Total daily consumption: {total_daily_consumption}")

        # Calculate the cost based on consumption
        if total_daily_consumption > 6000:
            cost = total_daily_consumption * 0.30  # Above 6000 kWh
        else:
            cost = total_daily_consumption * 0.18  # Below 6000 kWh

        # Return the total consumption and cost, both rounded to 3 decimal places
        return {
            "total_daily_consumption_kWh": round(total_daily_consumption, 3),
            "daily_cost_sar": round(cost, 2)  # Round to 2 decimal places for currency
        }
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log any errors for debugging
        raise HTTPException(status_code=500, detail=str(e))

# By MONTH 
@app.get("/data/byMonth")
async def get_monthly_consumption():
    try:
        # Get the current date (today) in the local timezone (Riyadh)
        today = datetime.now(local_tz)
        
        # Define the start of the current month and the end of the current month
        start_of_month_local = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_month = calendar.monthrange(today.year, today.month)[1]
        end_of_month_local = today.replace(day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999)

        # Print the local query range for debugging
        print(f"Querying from {start_of_month_local} to {end_of_month_local}")

        total_monthly_consumption = 0

        # Fetch documents from 'electricity_usage' collection for the current month in the local timezone (Riyadh)
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_month_local)\
            .where('timestamp', '<=', end_of_month_local)\
            .stream()

        # Log the number of documents fetched
        doc_count = 0
        for doc in docs:
            doc_count += 1
            data = doc.to_dict()
            total_channels_usage = data.get('total_channels_usage_kWh')

            # Log the document's timestamp and usage for debugging
            # print(f"Document timestamp: {data.get('timestamp')}, total_channels_usage_kWh: {total_channels_usage}")

            # Sum the available total_channels_usage_kWh for each document
            if total_channels_usage is not None:
                total_monthly_consumption += total_channels_usage

        print(f"Total documents fetched: {doc_count}")
        print(f"Total monthly consumption: {total_monthly_consumption}")

        # Classify the monthly consumption using the helper function
        classification = classify_consumption(total_monthly_consumption)

        if total_monthly_consumption <= 6000:
            cost = total_monthly_consumption * 0.18  # 0.18 SAR per kWh for consumption <= 6000 kWh
        else:
            cost = total_monthly_consumption * 0.30  # 0.30 SAR per kWh for consumption > 6000 kWh

        return {
            "total_monthly_consumption_kWh": round(total_monthly_consumption, 3),  # Round to 3 decimal places
            "classification": classification,
            "total_cost_sar": round(cost, 2)  # Round the cost to 2 decimal places
        }
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log any errors for debugging
        raise HTTPException(status_code=500, detail=str(e))

# Helper function to classify consumption
def classify_consumption(consumption_kWh):
    if consumption_kWh <= 2000:  # Example threshold for low
        return "Low"
    elif consumption_kWh <= 6000:  # Example threshold for average
        return "Average"
    else:
        return "High"

# Route to get the day with highest and lowest consumption for the month
@app.get("/data/consumption_range")
async def get_highest_and_lowest_consumption():
    try:
        today = datetime.now(local_tz)
        start_of_month_local = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_month = calendar.monthrange(today.year, today.month)[1]
        end_of_month_local = today.replace(day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999)

        # Fetch all documents within the current month
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_month_local)\
            .where('timestamp', '<=', end_of_month_local)\
            .stream()

        highest_day = None
        lowest_day = None
        highest_consumption = 0
        lowest_consumption = float('inf')

        for doc in docs:
            data = doc.to_dict()
            consumption = data.get('total_channels_usage_kWh', 0)
            timestamp = data.get('timestamp')

            if consumption > highest_consumption:
                highest_consumption = round(consumption, 3)  # Round to three decimal places
                highest_day = timestamp

            if consumption < lowest_consumption:
                lowest_consumption = round(consumption, 3)  # Round to three decimal places
                lowest_day = timestamp

        # Format highest and lowest days in Arabic manually
        highest_day_str = format_date_in_arabic(highest_day) if highest_day else None
        lowest_day_str = format_date_in_arabic(lowest_day) if lowest_day else None

        return {
            "highest_day": highest_day_str,
            "highest_consumption_kWh": highest_consumption,
            "lowest_day": lowest_day_str,
            "lowest_consumption_kWh": lowest_consumption
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper function to parse ISO 8601 dates
def parse_iso_format(date_str):
    try:
        return isoparse(date_str)
    except Exception as e:
        raise ValueError(f"Error parsing date: {str(e)}")

# Pydantic model to validate incoming request
class AggregateDataRequest(BaseModel):
    startDate: str
    endDate: str

# By DateRange
@app.post("/aggregateData")
async def aggregate_data(request_data: AggregateDataRequest):
    try:
        # Parse start and end dates from ISO 8601 format
        start_date = parse_iso_format(request_data.startDate)
        end_date = parse_iso_format(request_data.endDate)

        # Print parsed dates for debugging
        print(f"Start Date: {start_date}, End Date: {end_date}")

        # Query Firestore for the date range
        docs = db.collection('electricity_usage')\
                 .where('timestamp', '>=', start_date)\
                 .where('timestamp', '<=', end_date)\
                 .stream()

        # Aggregate the data
        total_usage = 0
        count = 0
        for doc in docs:
            data = doc.to_dict()
            total_usage += data.get('total_channels_usage_kWh', 0)
            count += 1

        # If no data is found
        if count == 0:
            return {"message": "No data found for the selected date range"}

        # Return the aggregated usage
        return {
            "total_usage_kWh": round(total_usage, 3),
            "data_points": count,
            "message": "Data aggregated successfully"
        }

    except ValueError as e:
        print(f"Error during data aggregation: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error during data aggregation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

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

@app.get("/outlets/byDay")
async def get_outlet_consumption_by_day():
    try:
        # Define the available channels (assuming you know the total set of channels)
        available_channels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']  # Modify as needed
        
        # Initialize the dictionary to store daily consumption, default to 0 for each channel
        outlet_consumption = {channel: 0 for channel in available_channels}

        # Get today's date in the local timezone (Riyadh)
        specific_date = datetime.now(local_tz).date()

        # Fetch documents from Firestore for today
        docs = db.collection('electricity_usage').stream()

        for doc in docs:
            data = doc.to_dict()

            # Check if 'channels' exist in the document
            if 'channels' not in data:
                continue  # Skip this document if channels are missing

            # Get the timestamp
            timestamp = data.get('timestamp')

            # If the timestamp is already a DatetimeWithNanoseconds object, work with it directly
            if isinstance(timestamp, DatetimeWithNanoseconds):
                timestamp = timestamp.replace(tzinfo=pytz.UTC).astimezone(local_tz)

                # Compare the date portion
                if timestamp.date() != specific_date:
                    continue  # Skip if the date doesn't match

            # Process each channel inside the 'channels' map
            channels = data.get('channels', {})
            for channel_id, channel_data in channels.items():
                usage = channel_data.get('usage', 0)
                # Accumulate the daily usage for each channel (if the channel is in available channels list)
                if channel_id in outlet_consumption:
                    outlet_consumption[channel_id] += usage

        return {"outlet_consumption": outlet_consumption}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
# ---------------------------------------------

# Run background task to fetch energy usage
@app.on_event("startup")
async def start_background_tasks():
    pass  # Placeholder, no operation
# threading.Thread(target=fetch_energy_usage, daemon=True).start()