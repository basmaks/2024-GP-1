# data.py

from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import Optional
import calendar
import pytz
from pydantic import BaseModel
from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds
from dateutil.parser import isoparse
from google.cloud import firestore
from backend.firebase import db
from backend.utils import format_date_in_arabic

router = APIRouter()

# Set your local timezone (for Riyadh, use UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

# By SECOND
@router.get("/bySecond")
async def get_recent_usage():
    docs = db.collection('electricity_usage').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1).stream()
    usage_data = [doc.to_dict() for doc in docs]

    if usage_data:
        return {"status": "success", "data": usage_data}
    else:
        return {"status": "error", "message": "No data found"}

# By HOUR
@router.get("/byHour")
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

        return {"hourly_consumption": hourly_consumption}

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# By DAY
@router.get("/byDay")
async def get_daily_consumption_and_cost():
    try:
        # Get the current date (today) in the local timezone (Riyadh)
        today = datetime.now(local_tz)
        
        # Define the start and end of the current day in the local timezone (Riyadh)
        start_of_day_local = today.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day_local = today.replace(hour=23, minute=59, second=59, microsecond=999999)

        total_daily_consumption = 0

        # Fetch documents from 'electricity_usage' collection for the current day in the local timezone (Riyadh)
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_day_local)\
            .where('timestamp', '<=', end_of_day_local)\
            .stream()

        for doc in docs:
            data = doc.to_dict()
            total_channels_usage = data.get('total_channels_usage_kWh')

            # Sum the available total_channels_usage_kWh for each document
            if total_channels_usage is not None:
                total_daily_consumption += total_channels_usage

        # Calculate the cost based on consumption
        if total_daily_consumption > 6000:
            cost = total_daily_consumption * 0.30  # Above 6000 kWh
        else:
            cost = total_daily_consumption * 0.18  # Below 6000 kWh

        return {
            "total_daily_consumption_kWh": round(total_daily_consumption, 3),
            "daily_cost_sar": round(cost, 2)  # Round to 2 decimal places for currency
        }
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# By MONTH
@router.get("/byMonth")
async def get_monthly_consumption():
    try:
        # Get the current date (today) in the local timezone (Riyadh)
        today = datetime.now(local_tz)
        
        # Define the start of the current month and the end of the current month
        start_of_month_local = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_month = calendar.monthrange(today.year, today.month)[1]
        end_of_month_local = today.replace(day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999)

        total_monthly_consumption = 0

        # Fetch documents from 'electricity_usage' collection for the current month in the local timezone (Riyadh)
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_month_local)\
            .where('timestamp', '<=', end_of_month_local)\
            .stream()

        doc_count = 0
        for doc in docs:
            doc_count += 1
            data = doc.to_dict()
            total_channels_usage = data.get('total_channels_usage_kWh')

            if total_channels_usage is not None:
                total_monthly_consumption += total_channels_usage

        # Classify the monthly consumption using the helper function
        classification = classify_consumption(total_monthly_consumption)

        if total_monthly_consumption <= 6000:
            cost = total_monthly_consumption * 0.18  # 0.18 SAR per kWh for consumption <= 6000 kWh
        else:
            cost = total_monthly_consumption * 0.30  # 0.30 SAR per kWh for consumption > 6000 kWh

        return {
            "total_monthly_consumption_kWh": round(total_monthly_consumption, 3),
            "classification": classification,
            "total_cost_sar": round(cost, 2)
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
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
@router.get("/consumption_range")
async def get_highest_and_lowest_consumption():
    try:
        today = datetime.now(local_tz)
        start_of_month_local = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_month = calendar.monthrange(today.year, today.month)[1]
        end_of_month_local = today.replace(day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999)

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
                highest_consumption = round(consumption, 3)
                highest_day = timestamp

            if consumption < lowest_consumption:
                lowest_consumption = round(consumption, 3)
                lowest_day = timestamp

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
@router.post("/aggregateData")
async def aggregate_data(request_data: AggregateDataRequest):
    try:
        start_date = parse_iso_format(request_data.startDate)
        end_date = parse_iso_format(request_data.endDate)

        docs = db.collection('electricity_usage')\
                 .where('timestamp', '>=', start_date)\
                 .where('timestamp', '<=', end_date)\
                 .stream()

        total_usage = 0
        count = 0
        for doc in docs:
            data = doc.to_dict()
            total_usage += data.get('total_channels_usage_kWh', 0)
            count += 1

        if count == 0:
            return {"message": "No data found for the selected date range"}

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
