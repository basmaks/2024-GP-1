#---------------dailyUsageAggregator.py---------------

# API ENDPOINT: http://127.0.0.1:5001/aggregateData (IP address may vary based on computer / device)

# 1. Navigate to api folder path. For example: cd /User/Desktop/2024-GP-1/api/dailyUsageAggregator.py
# 2. Make sure to replace with the actual path to your JSON file instead of "your/service/account/file/path/here.json".
# 3. Use this command in terminal to run the script: python3 dailyUsageAggregator.py or python dailyUsageAggregator.py (depends on python version).

from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import pytz

app = Flask(__name__)
cred = credentials.Certificate('/Users/basmaalsulaim/Downloads/2024-GP-1-main/FIREBASE CREDENTIALS gp2024 gmail/murshid-gp2-765b5-firebase-adminsdk-aa1fe-98b1ef85bf.json') # REPLACE THIS WITH THE ACTUAL PATH OF THE SERVICE ACCOUNT FILE IN YOUR COMPUTER
firebase_admin.initialize_app(cred)
db = firestore.client()
riyadh_tz = pytz.timezone('Asia/Riyadh')

@app.route('/aggregateData', methods=['POST'])
def aggregate_data():
    data_request = request.get_json()
    start_date_str = data_request['startDate']
    end_date_str = data_request['endDate']

    # Convert string dates to datetime objects assuming they are in UTC+3
    start_date = riyadh_tz.localize(datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M:%S.%fZ'))
    end_date = riyadh_tz.localize(datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M:%S.%fZ'))

    # Adjust to cover the entire day
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    print(f"Querying from {start_date} to {end_date}")  # Debug output

    # Query Firestore
    docs = db.collection('electricity_usage').where('timestamp', '>=', start_date).where('timestamp', '<=', end_date).stream()

    aggregated_data = {}
    for doc in docs:
        doc_data = doc.to_dict()
        day = doc_data['timestamp'].date()  # Assuming timestamp is a datetime object
        if day not in aggregated_data:
            aggregated_data[day] = 0
        aggregated_data[day] += doc_data.get('total_channels_usage_kWh', 0)  # Safe fallback

    # Convert aggregated data to a suitable format for the chart
    response_data = [{'date': key.strftime('%Y-%m-%d'), 'usage': value} for key, value in aggregated_data.items()]
    print("Aggregated Data:", response_data)

    return jsonify(response_data)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
