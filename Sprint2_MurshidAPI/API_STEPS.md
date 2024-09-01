**STEP 1:     FIREBASE (Done only once):**

1. Go to https://firebase.google.com/
2. Sign in to Murshid username and password. 
3. Click Go to console
4. Select Murshid database
5. Select Firestore database from side menu
6. From project overview (on the side menu) click the settings icon.
7. Click project settings. 
8. Select service accounts 
9. Click generate new private key (from now on referred to as FIREBASE SERVICE ACCOUNT). 
10. Save FIREBASE SERVICE ACCOUNT file somewhere safe (a folder that you won’t ever delete). 
11. Save the FIREBASE SERVICE ACCOUNT  file path.

----------------------------------------------------------------------------------

**STEP 2:    API.PY CODE (Done every single time you run the code):**

1. Download the updated MurshidAPI_S2 code from GitHub. 
2. Open MurshidAPI_S2 folder in VSCode. 
3. Open a new terminal. 
4. Write in terminal: export FIREBASE_SERVICE_ACCOUNT_FILE="/path/to/your/service_account.json"  
5. To make sure its saved write this in the terminal: echo $FIREBASE_SERVICE_ACCOUNT_FILE ***IMPO: replace path with your actual FIREBASE SERVICE ACCOUNT file path***
6. Run api.py code: python3 api.py or python api.py
7. (Optional) Go to http://127.0.0.1:5000/api/getRecentUsage to make sure everything works. 
