from fastapi import APIRouter, HTTPException
from datetime import datetime
import pytz
from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds
from google.api_core.retry import Retry
from backend.firebase import db

router = APIRouter()

# Set your local timezone (for Riyadh, use UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

@router.get("/byDay")
async def get_outlet_consumption_by_day():
    try:
        # Define the available channels (assuming you know the total set of channels)
        available_channels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']  # Modify as needed

        # Initialize the dictionary to store daily consumption, default to 0 for each channel
        outlet_consumption = {channel: 0 for channel in available_channels}

        # Get the start and end of today in the local timezone (Riyadh)
        now = datetime.now(local_tz)
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Fetch documents from Firestore for today, using range filtering on timestamp
        docs = db.collection('electricity_usage').where(
            "timestamp", ">=", start_of_day
        ).where(
            "timestamp", "<=", end_of_day
        ).stream(retry=Retry(deadline=60))

        for doc in docs:
            data = doc.to_dict()

            # Check if 'channels' exist in the document
            if 'channels' not in data:
                continue  # Skip this document if channels are missing

            # Process each channel inside the 'channels' map
            channels = data.get('channels', {})
            for channel_id, channel_data in channels.items():
                usage = channel_data.get('usage', 0)
                # Accumulate the daily usage for each channel
                if channel_id in outlet_consumption:
                    outlet_consumption[channel_id] += usage

        return {"outlet_consumption": outlet_consumption}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")