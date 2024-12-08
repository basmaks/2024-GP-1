# export.py 

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from io import BytesIO
from datetime import datetime, timedelta
import pandas as pd
from backend.firebase import db

router = APIRouter()

@router.get("/", summary="Export data in CSV format")
async def export_data(
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format")
):
    # Convert start_date and end_date to Python datetime objects
    start_date_obj = datetime.fromisoformat(start_date)
    end_date_obj = datetime.fromisoformat(end_date)

    # Adjust the end_date_obj to include the entire end date
    end_date_obj = end_date_obj + timedelta(days=1) - timedelta(seconds=1)

    # Query the database for the specified date range
    docs = db.collection("electricity_usage").where(
        "timestamp", ">=", start_date_obj
    ).where(
        "timestamp", "<=", end_date_obj
    ).stream()

    # Parse Firestore documents into a list of dictionaries
    data = []
    for doc in docs:
        record = doc.to_dict()
        # Extract the date from the timestamp
        record_date = record["timestamp"].strftime("%Y-%m-%d")

        # Prepare the row with channel data dynamically
        row = {
            "التاريخ": record_date,
            "إجمالي الاستهلاك (كيلوواط)": record.get("total_channels_usage_kWh", 0),
        }
        for channel_num, channel_data in record.get("channels", {}).items():
            row[f"مقبس {channel_num}"] = channel_data.get("usage", 0)
        data.append(row)

    # Handle case where no data is returned
    if not data:
        data.append({"التاريخ": "لا توجد بيانات", "إجمالي الاستهلاك (كيلوواط)": 0})

    # Convert the data to a DataFrame
    df = pd.DataFrame(data)

    # Group data by date and aggregate values
    grouped_df = df.groupby("التاريخ").sum().reset_index()

    # Write the DataFrame to CSV format
    output = BytesIO()
    grouped_df.to_csv(output, index=False)
    output.seek(0)

    # Return the CSV file as a response
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=data_{start_date}_to_{end_date}.csv"
        }
    )