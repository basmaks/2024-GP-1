![Murshid App](banner.png)
# Murshid: A Comprehensive Home Electricity Monitoring and Safety Solution

## About Murshid

Murshid is a mobile application designed to transform how users monitor and manage electricity consumption in their homes, with a primary focus on safety alerts and anomaly detection to promptly inform users of high spikes or sudden drops in electricity usage. This proactive approach enhances household safety and prevents damage caused by electrical faults. Setting itself apart as the only app of its kind in the region, Murshid provides live updates, real-time safety alerts, and a fully localized experience in Arabic. Unlike traditional energy monitoring tools that simply display numbers, Murshid empowers users with actionable insights, offering them peace of mind and full control over their electricity consumption.

## Tech Stack 

- **Frontend**: React Native with Expo
- **Backend**: Python, FastAPI, and Firebase Firestore
- **Anomaly Detection Model**: Isolation Forest
- **Hardware**: Energy Monitor Device installed on the electrical panel

## How to Install

1. **Clone the repository** `https://github.com/basmaks/2024-GP-1.git`
2. **For Android**: 
  -   Open the repository link on your Android mobile device.
  -   Download the Murshid APK file.
  -   Go to your Downloads folder.
  -   Tap on the APK file and allow installation when prompted.
  -   Once the installation is complete, open the app.
3. **For iOS**: 
  -   Open the repository link on your iOS mobile device.
  -   Download the Murshid IPA file.
  -   Go to your Downloads folder.
  -   Tap on the IPA file and confirm installation when prompted.
  -   Once the installation is complete, open the app.

## How to Run 

1. **Open the repository in Visual Studio Code** 

2. **Terminal 1: Run the Backend Server**
  - Export the Firebase credentials: `export FIREBASE_CREDENTIALS="path/to/firebase/credentials/json/file"`
  - Run the server:
    - For Local Testing (e.g., using a simulator): `uvicorn backend.main:app --reload`
    - For Mobile Testing (using the Expo app, IPA, or APK file): `uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000`

3. **Terminal 2: Start Background Sync**
  - Navigate to backend folder: `cd backend`
  - Export the Firebase credentials: `export FIREBASE_CREDENTIALS="path/to/firebase/credentials/json/file"`
  - Run the background task script to start syncing real-time data: `python3 background_task.py`

4. **Terminal 3: Expo Go App (Only)**
  - If using the Expo app, start the app with: `npx expo start`


**Note:** If you are using the app on a physical device, make sure to update the backend API endpoints in the app to match your computer's IP address (e.g., `http://<your-computer-ip>:8000`). 

## Anomaly Detection Model

Murshid employs an Isolation Forest model for anomaly detection, achieving a remarkable F1 score of 98.23%. This unsupervised model effectively identifies high spikes and sudden drops in electricity consumption. To review the model's implementation and performance, visit the [Google Colab notebook](https://colab.research.google.com/drive/1z7yoQ8q5YFUIOsd1jvU6-UKr5BBlhWe4?usp=sharing).

