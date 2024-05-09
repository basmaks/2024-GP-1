# 2024-GP-1
# Murshid: An Energy Monitoring, Recommendation, and Safety Alert System

## Introduction

Murshid is a mobile application that gives homeowners precise control over their electricity consumption. It displays real-time usage data, offers personalized recommendations, and alerts users to safety issues. The app enables informed decision-making to optimize energy use, reduce costs, and enhance household safety.


## Technology 

- **Frontend**: React Native with Expo for iOS and Android app development.
- **Backend**: Python for API integration.
- **Emulator**: Xcode for iOS and Android Studio for Android.
- **Database**: Firebase Firestore for real-time data management.


## Launching Instructions

### Prerequisites

- Install Node.js and npm.
- Install Expo CLI.
- Android Studio for Android emulation and Xcode for iOS emulation.
- Visual Studio Code is recommended for development.


### Installation 

**1. Clone the repository:**
   - git clone https://github.com/yourusername/2024-GP-1.git
   - Navigate to the project directory: cd 2024-GP-1

**2. Install dependencies:**
   - Run npm install to install all necessary dependencies.


### Configuration 

- **Firebase Configuration:** Add the Firebase service account credentials path to api.py.
- **Expo Configuration:** Ensure app.json is set up with the correct settings.


### Usage

1. **Start the Flask server**:
   - Run the command below to start the Flask server defined in api.py. This step is necessary to enable real-time data syncing, which populates the data charts in the React Native app.
`
   python api.py
`

2. **Launch the application using Expo**:
  - Run the following command to start the Metro bundler and launch the application:
`
  npx expo start
`

3. **Launch on iOS or Android**:
  - **For emulators:** The iOS Simulator or Android Emulator will automatically open if configured.
  - **For physical devices:** Use the Expo client app on your device then scan the QR code displayed in the Expo CLI to open your project directly on your device.


### Additional Notes

- Review `metro.config.js` for any necessary configuration adjustments.
