import AppNavigation from './navigation/appNavigation';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotificationAsync, repeatEveryDay } from 'expo-notifications'; 
import { db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Define the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Function to send push notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Function to handle registration errors
function handleRegistrationError(errorMessage) {
  alert('Error: '+errorMessage);
  throw new Error(errorMessage);
}

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    // const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const projectId = '4c1322b0-9c03-4234-8594-dcaf3d011ccc';
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}



export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(undefined);
const notificationListener = useRef();
const responseListener = useRef();

useEffect(() => {
  registerForPushNotificationsAsync()
    .then(async (token) =>{
      // alert('token: '+token)
      await AsyncStorage.setItem('token', token);
      setExpoPushToken(token || '')})
    .catch((error) => setExpoPushToken(`${error}`));

  notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log(response);
  });

  return () => {
    notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
    responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);

useEffect(() => {
  scheduleDailyNotification();
}, []);
  return (
    <AppNavigation />
  );
}




// daily notifications
// Function to fetch a random recommendation tip from Firebase
const fetchRandomTip = async () => {
  try {
    const recommendationsRef = collection(db, 'recommendations');
    const querySnapshot = await getDocs(recommendationsRef);
    const tipDocs = querySnapshot.docs.map(doc => doc.data().tip);
    const randomTip = tipDocs[Math.floor(Math.random() * tipDocs.length)];
    return randomTip;
  } catch (error) {
    console.error('Error fetching recommendation tip:', error);
    return null;
  }
};

// Function to schedule a daily local notification with the fetched recommendation tip
const scheduleDailyNotification = async () => {
  try {
    // Fetch a random recommendation tip
    const randomTip = await fetchRandomTip();

    if (randomTip) {
      // Schedule a local notification to be sent daily with the recommendation tip
      const notificationId = 'daily-recommendation';
      const content = {
        title: 'Murshid',
        body: randomTip,
      };

      // Calculate the trigger time for 9:10 AM
      const triggerTime = new Date();
      triggerTime.setHours(9, 10, 0); // Set the time to 9:10 AM

      // Schedule the notification to repeat every day at 9:10 AM
      await scheduleNotificationAsync({
        content,
        trigger: {
          hour: 9,
          minute: 10,
          repeats: true
        },
        identifier: notificationId,
      });

      console.log('Daily notification scheduled successfully!');
    } else {
      console.log('No recommendation tip found.');
    }
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
  }
};