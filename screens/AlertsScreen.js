import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNavBar2 from '../navigation/TopNavBar2';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import * as Icons from 'react-native-heroicons/outline';
import { auth} from '../config/firebase'
import { doc, getDoc,getDocs, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from '../config/firebase';
import { LineChart } from 'react-native-chart-kit';
import Kwh_RealTimeChart from '../charts/Kwh_RealTimeChart';//1
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function AlertsScreen() {

  const navigation = useNavigation();
  const [hazards, setHazards] = useState([]);

  const [dailyUsageExceeded, setDailyUsageExceeded] = useState(false);//2 for hazard01


  //normal fetches all hazards
  useEffect(() => {
 // Fetch user alerts and hazard titles
const fetchUserAlerts = async () => {
  try {
    // Fetch user alerts
    const userAlertsRef = collection(db, 'userAlerts', auth.currentUser.uid, 'alerts');
    const querySnapshot = await getDocs(userAlertsRef);
    const userAlertsData = querySnapshot.docs.map(doc => ({
      hazardId: doc.data().hazardId,
      timestamp: doc.data().timestamp.toDate()
    }));

    // Fetch hazard titles based on hazardIds from userAlerts
    const hazardTitles = {}; // Map to store hazard titles
    const hazardsRef = collection(db, 'hazards');
    const hazardsSnapshot = await getDocs(hazardsRef);
    hazardsSnapshot.forEach(doc => {
      hazardTitles[doc.id] = doc.data().title;
    });

    // Update user alerts data with hazard titles
    const userAlertsWithTitles = userAlertsData.map(alert => ({
      ...alert,
      title: hazardTitles[alert.hazardId]
    }));

    // Set the updated user alerts data with titles to state
    setHazards(userAlertsWithTitles);
  } catch (error) {
    console.error('Error fetching user alerts:', error);
  }
};

async function sendPushNotification(expoPushToken) {
  // Check if the device is iOS
  const isIOS = Platform.OS === 'ios';

  // If the device is iOS, return without sending the notification
  if (isIOS) {
    console.log('Notification not sent. Device is iOS.');
    return;
  }

  // If the device is Android, proceed to send the notification
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'مرشد',
    body: 'تنبية:'+hazardContent,
    data: { someData: 'goes here' },
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    console.log('Notification sent successfully.');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}


    
    fetchUserAlerts();



    const checkDailyUsage = async () => {
      try {
        const response = await fetch('https://1b84-2-88-140-5.ngrok-free.app/api/getRecentUsage');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const jsonData = await response.json();
    
        let totalDailyUsage = 0;
        for (const deviceId in jsonData) {
          const device = jsonData[deviceId];
          if (device && typeof device === 'object' && device.channels) {
            for (const channelId in device.channels) {
              const channel = device.channels[channelId];
              if (channel && typeof channel === 'object' && !isNaN(channel.usage)) {
                totalDailyUsage += Number(channel.usage);
              }
            }
          }
        }
    
        // Check for each hazard condition
        if (totalDailyUsage > 5) {
          handleHazard('hazard01');
        }
        if (totalDailyUsage > 10) {
          handleHazard('hazard02');
        }
        if (totalDailyUsage > 20) {
          handleHazard('hazard03');
        }
        if (totalDailyUsage > 29) {
          handleHazard('hazard04');
        }
        if (totalDailyUsage > 0.000000000007) {
          handleHazard('hazard05');
        }
        if (totalDailyUsage > 67) {
          handleHazard('hazard06');
        }
        if (totalDailyUsage > 76) {
          handleHazard('hazard07');
        }
      } catch (error) {
        console.error('Error fetching real-time usage:', error);
      }
    };
    
    const handleHazard = async (hazardId) => {
      try {
        const userUid = auth.currentUser?.uid;
        if (!userUid) {
          console.error('No authenticated user available.');
          return;
        }
    
        // Directly get the user's notification settings document
        const userDocRef = doc(db, 'notificationsdb', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
    
        if (!userDocSnapshot.exists()) {
          console.error('User data not found.');
          return;
        }
    
        const userData = userDocSnapshot.data();
        console.log('userData: ', userData);
        const expoPushToken = userData.token_id;
    // Fetch hazard content
    const hazardRef = doc(db, 'hazards', hazardId);
    const hazardDoc = await getDoc(hazardRef);
    const hazardContent = hazardDoc.data().title;
        if (expoPushToken) {
          await sendPushNotification(expoPushToken, hazardContent); // Assuming this function is properly defined elsewhere
          const userAlertsRef = collection(db, 'userAlerts', userUid, 'alerts');
          await addDoc(userAlertsRef, {
            hazardId: hazardId,
            timestamp: new Date()
          });
          console.log('Hazard alert added successfully.');
        } else {
          console.error('No push token available.');
        }
      } catch (error) {
        console.error('Error handling hazard:', error);
      }
    };

    


    fetchUserAlerts();
    checkDailyUsage(); // Check daily usage when component mounts for condition 1 hazard01
    

     // Fetch hazards and check daily usage every 5 minutes for hazard01
     const intervalId = setInterval(() => {
      fetchUserAlerts();
      checkDailyUsage();
    }, 5 * 60 * 1000);

    // Clear interval on component unmount for hazard01
    return () => clearInterval(intervalId);

  }, []);
  

  const renderHazardItem = ({ item }) => (
    <View style={styles.hazardItem}>
      <View style={styles.contentContainer}>
        <Text style={styles.hazardTitle}>{item.title}</Text>
        <Icons.ExclamationCircleIcon size={24} style={styles.icon} />
      </View>
      <View style={styles.dateTimeContainer}>
  <Text style={styles.dateTimeTextLeft}>التاريخ: {item.timestamp.toLocaleDateString('ar-EG')}</Text>
  <Text style={styles.dateTimeTextRight}>الوقت: {item.timestamp.toLocaleTimeString('ar-EG')}</Text>
</View>

    </View>
  );
  


  
  return (
    <View style={styles.container}>
      <TopNavBar2 />

      <View style={styles.alertsSection}>

      <Text style={styles.header}>التنبيهات</Text>
      <FlatList
  data={hazards}
  renderItem={renderHazardItem}
  keyExtractor={(item, index) => index.toString()} // Use index as the key
/>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg, // Set background color
  },
  alertsSection:
  {
    margin: 20,
  },
  header: {
    fontSize: 20, // Adjust font size
    fontWeight: 'bold',
    color: 'white', // Set text color
    textAlign: 'right', // Align text to the right
    marginBottom: 20,
  },
  hazardItem: {
    backgroundColor: 'white', // Set background color
    padding: 20,
    marginBottom: 10,
    borderRadius: 15, // Adjust border radius
    //textAlign: 'right', // Align text to the right
    paddingBottom: 15,

    
  },
  hazardTitle: {
    fontSize: 16, // Adjust font size
    textAlign: 'right', // Align text to the right
   // marginRight: 10,
   //backgroundColor: 'blue', // Set background color
   flex: 1, // Allow the title to expand and fill available space
  },
  contentContainer: {
    //alignItems: 'center',
    //backgroundColor: 'pink', // Set background color
    flexDirection: 'row',
    

  },
  icon: {
    marginLeft: 10,
    color: 'red',
    //backgroundColor: 'green', // Set background color

  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    //backgroundColor: 'green', // Set background color

    
  },
  dateTimeText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'right',
    
  },
  dateTimeTextLeft: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'left',
  },
  dateTimeTextRight: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'right',
  },

});


