import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNavBar2 from '../navigation/TopNavBar2';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import * as Icons from 'react-native-heroicons/outline';
import { auth} from '../config/firebase'
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
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
    const fetchHazards = async () => {
      try {
        const hazardsRef = collection(db, 'hazards');
        const querySnapshot = await getDocs(hazardsRef);
        const hazardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          date: getRandomDate(),
          time: getRandomTime()
        }));
        setHazards(hazardData);
      } catch (error) {
        console.error('Error fetching hazards:', error);
      }
    };


    //condition for hazard01 overloaded circuit example used: exceeding 5kwh
    const checkDailyUsage = async () => {
      try {
        // Fetch real-time usage data from your API
        const response = await fetch('http://127.0.0.1:5000/api/getRecentUsage');
    
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const jsonData = await response.json();
    
        // Calculate total daily usage
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
    
        // Update daily usage exceeded state
        setDailyUsageExceeded(totalDailyUsage > 5);
    
        // Check if hazard01 occurred
        if (totalDailyUsage > 5) {
          // Fetch the Expo push token from Firebase for the current user
          const usersRef = collection(db, 'notificationsdb');
          const querySnapshot = await getDocs(query(usersRef, where('uid', '==', auth.currentUser.uid)));
    
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const expoPushToken = userData.token_id;
    
            // Check if expoPushToken is available
            if (expoPushToken) {
              // Send push notification
              await sendPushNotification(expoPushToken);
            }
          }
        }
    
      } catch (error) {
        console.error('Error fetching real-time usage:', error);
      }
    };
    //done condition1


    fetchHazards(); // Fetch hazards when component mounts regardless of condition
    checkDailyUsage(); // Check daily usage when component mounts for condition 1 hazard01


     // Fetch hazards and check daily usage every 5 minutes for hazard01
     const intervalId = setInterval(() => {
      fetchHazards();
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
        <Text style={styles.dateTimeText}>Date: {item.date}</Text>
        <Text style={styles.dateTimeText}>Time: {item.time}</Text>
      </View>
    </View>
  );


  
  return (
    <View style={styles.container}>
      <TopNavBar2 />

      <View style={styles.alertsSection}>

      <Text style={styles.header}>التنبيهات</Text>
      <FlatList
          data={hazards.filter(item => item.id === 'hazard01')}
          renderItem={renderHazardItem}
        keyExtractor={item => item.id}
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

});

function getRandomDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

function getRandomTime() {
  const date = new Date();
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);
  return `${hour}:${minute}:${second}`;
}
