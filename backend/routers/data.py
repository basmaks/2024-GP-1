# data.py

from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
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

# By WEEK
@router.get("/byWeek")
async def get_weekly_consumption(start_date: Optional[str] = None):
    try:
        # Determine the start date of the week (default to this week if not provided)
        if start_date:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        else:
            today = datetime.now(local_tz)
            start_date_obj = today - timedelta(days=today.weekday())  # Monday of the current week
        
        # Calculate the end of the week
        end_date_obj = start_date_obj + timedelta(days=6)

        # Ensure datetime objects are naive before localizing
        if start_date_obj.tzinfo is not None:
            start_date_obj = start_date_obj.replace(tzinfo=None)

        if end_date_obj.tzinfo is not None:
            end_date_obj = end_date_obj.replace(tzinfo=None)

        # Localize to the timezone and convert to UTC
        start_date_utc = local_tz.localize(start_date_obj).astimezone(pytz.utc)
        end_date_utc = local_tz.localize(end_date_obj).astimezone(pytz.utc)

        # Initialize a dictionary to store daily consumption
        daily_consumption = {day: 0 for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}

        # Fetch and aggregate data
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_date_utc)\
            .where('timestamp', '<=', end_date_utc)\
            .stream()

        for doc in docs:
            data = doc.to_dict()
            timestamp = data.get('timestamp')

            if isinstance(timestamp, DatetimeWithNanoseconds):
                # Convert Firestore timestamp to Python datetime
                timestamp_dt = timestamp.replace(tzinfo=pytz.UTC).astimezone(local_tz)

                # Determine the day of the week (e.g., Sunday, Monday)
                day_of_week = timestamp_dt.strftime("%A")  # Get the day name (Sunday, Monday, etc.)

                # Aggregate consumption for that day
                daily_consumption[day_of_week] += data.get('total_channels_usage_kWh', 0)

        # Round the values for better readability
        daily_consumption = {day: round(value, 3) for day, value in daily_consumption.items()}

        return {"daily_consumption_kWh": daily_consumption}

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        daily_consumption = {day: 0 for day in range(1, last_day_of_month + 1)}

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
            timestamp = data.get('timestamp')

            if total_channels_usage is not None and isinstance(timestamp, DatetimeWithNanoseconds):
                total_monthly_consumption += total_channels_usage

                # Convert Firestore timestamp to local datetime
                timestamp_dt = timestamp.replace(tzinfo=pytz.UTC).astimezone(local_tz)
                day_of_month = timestamp_dt.day

                # Add to the corresponding day's consumption
                daily_consumption[day_of_month] += total_channels_usage

        # Classify the monthly consumption using the helper function
        classification = classify_consumption(total_monthly_consumption)

        if total_monthly_consumption <= 6000:
            cost = total_monthly_consumption * 0.18  # 0.18 SAR per kWh for consumption <= 6000 kWh
        else:
            cost = total_monthly_consumption * 0.30  # 0.30 SAR per kWh for consumption > 6000 kWh

        return {
            "total_monthly_consumption_kWh": round(total_monthly_consumption, 3),
            "classification": classification,
            "total_cost_sar": round(cost, 2),
            "daily_consumption_kWh": {str(day): round(consumption, 3) for day, consumption in daily_consumption.items()}
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

# byYEAR
@router.get("/byYear")
async def get_yearly_consumption():
    try:
        # Import Firestore client
        from google.cloud.firestore import Client

        # Initialize Firestore client
        db = Client()

        # Get the current year based on local timezone
        current_year = datetime.now(local_tz).year

        # Define the start and end of the current year
        start_of_year_local = datetime(current_year, 1, 1, 0, 0, 0)
        end_of_year_local = datetime(current_year, 12, 31, 23, 59, 59)

        # Convert to UTC
        start_of_year_utc = local_tz.localize(start_of_year_local).astimezone(pytz.utc)
        end_of_year_utc = local_tz.localize(end_of_year_local).astimezone(pytz.utc)

        print(f"Fetching data for year: {current_year}")
        print(f"Start: {start_of_year_utc}, End: {end_of_year_utc}")

        # Fetch documents
        docs = db.collection('electricity_usage')\
            .where('timestamp', '>=', start_of_year_utc)\
            .where('timestamp', '<=', end_of_year_utc)\
            .stream()

        # Initialize a dictionary to store monthly consumption
        monthly_consumption = {month: 0 for month in range(1, 13)}
        total_yearly_consumption = 0

        for doc in docs:
            data = doc.to_dict()
            total_channels_usage = data.get('total_channels_usage_kWh', 0)
            timestamp = data.get('timestamp')

            if isinstance(timestamp, DatetimeWithNanoseconds):
                # Convert Firestore timestamp to local datetime
                timestamp_dt = timestamp.replace(tzinfo=pytz.UTC).astimezone(local_tz)
                month = timestamp_dt.month  # Get the month as a number (1-12)

                # Add consumption to the respective month
                monthly_consumption[month] += total_channels_usage
                total_yearly_consumption += total_channels_usage

        # Prepare the response with month names
        monthly_consumption_named = {
            calendar.month_abbr[month]: round(consumption, 3) for month, consumption in monthly_consumption.items()
        }

        return {
            "total_yearly_consumption_kWh": round(total_yearly_consumption, 3),
            "monthly_consumption_kWh": monthly_consumption_named
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


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

class DateRangeRequest(BaseModel):
    startDate: str
    endDate: str

@router.post("/byDateRange")
async def get_date_range_data(request: DateRangeRequest):
    try:
        # Parse the start and end dates
        start_date = datetime.fromisoformat(request.startDate)
        end_date = datetime.fromisoformat(request.endDate)

        # Ensure dates are localized to your timezone and convert to UTC
        if start_date.tzinfo is None:
            start_date_utc = local_tz.localize(start_date).astimezone(pytz.utc)
        else:
            start_date_utc = start_date.astimezone(pytz.utc)

        if end_date.tzinfo is None:
            end_date_utc = local_tz.localize(end_date).astimezone(pytz.utc)
        else:
            end_date_utc = end_date.astimezone(pytz.utc)

        # Query Firestore for documents in the date range
        docs = db.collection("electricity_usage")\
            .where(field_path="timestamp", op_string=">=", value=start_date_utc)\
            .where(field_path="timestamp", op_string="<=", value=end_date_utc)\
            .stream()

        daily_consumption = {}
        for doc in docs:
            data = doc.to_dict()
            total_usage = data.get("total_channels_usage_kWh", 0)
            timestamp = data.get("timestamp")

            if isinstance(timestamp, DatetimeWithNanoseconds):
                timestamp_dt = timestamp.replace(tzinfo=pytz.UTC).astimezone(local_tz)
                day = timestamp_dt.strftime("%Y-%m-%d")  # Format as YYYY-MM-DD

                if day not in daily_consumption:
                    daily_consumption[day] = 0

                daily_consumption[day] += total_usage

        # Prepare response
        if not daily_consumption:
            return {"message": "No data found for the selected date range"}

        sorted_consumption = sorted(daily_consumption.items())
        labels = [day for day, _ in sorted_consumption]
        data_points = [round(consumption, 3) for _, consumption in sorted_consumption]

        return {
            "labels": labels,
            "data_points": data_points,
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))