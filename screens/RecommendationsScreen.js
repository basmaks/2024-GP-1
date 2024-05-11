import { Platform, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import * as Icons from 'react-native-heroicons/outline';
import { auth} from '../config/firebase'
import { doc, getDoc,getDocs, setDoc, addDoc, collection,query,where } from "firebase/firestore";
import { db } from '../config/firebase';
import { LineChart } from 'react-native-chart-kit';
import Kwh_RealTimeChart from '../charts/Kwh_RealTimeChart';//1
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecommendationsScreen() {

  const navigation = useNavigation();
  const [userTips, setUserTips] = useState([]);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [dailyUsageExceeded, setDailyUsageExceeded] = useState(false);

  useEffect(() => {
    const fetchUserTips = async () => {
      try {
        const userTipsRef = collection(db, 'userTips', auth.currentUser.uid, 'Tips');
        const querySnapshot = await getDocs(userTipsRef);
        const userTipsData = querySnapshot.docs.map(doc => ({
          tipId: doc.data().tipId,
         
        }));

        const tipTitles = {};
        const tipsRef = collection(db, 'recommendations');
        const tipsSnapshot = await getDocs(tipsRef);
        tipsSnapshot.forEach(doc => {
          tipTitles[doc.id] = doc.data().tip;
        });

        const userTipsWithTitles = userTipsData.map(tip => ({
          ...tip,
          title: tipTitles[tip.tipId]
        }));

        setUserTips(userTipsWithTitles);
      } catch (error) {
        console.error('Error fetching user tips:', error);
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
        body: tipContent,
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
    
        if (totalDailyUsage > 0.0003) {
          handleTip('tip01');
        }
        if (totalDailyUsage > 0.00038) {
          handleTip('tip02');
        }
        if (totalDailyUsage > 0.00039) {
          handleTip('tip03');
        }
        if (totalDailyUsage > 0.0004355) {
          handleTip('tip04');
        }
        if (totalDailyUsage > 0.000368) {
          handleTip('tip05');
        }
        if (totalDailyUsage > 0.0003355) {
          handleTip('tip06');
        }
        if (totalDailyUsage > 0.0003955) {
          handleTip('tip07');
        }
          if (totalDailyUsage > 0.0004) {
            handleTip('tip08');
        }

        // Add more conditions for other tips as needed...
      } catch (error) {
        console.error('Error fetching real-time usage:', error);
      }
    };
    
    const handleTip = async (tipId) => {
      try {
        const userUid = auth.currentUser?.uid;
        if (!userUid) {
          console.error('No authenticated user available.');
          return;
        }
    
        const userTipsRef = collection(db, 'userTips', userUid, 'Tips');
        const existingTipQuery = query(userTipsRef, where('tipId', '==', tipId));
        const existingTipSnapshot = await getDocs(existingTipQuery);
        
        if (!existingTipSnapshot.empty) {
          console.log('Tip already exists.');
          return;
        }
        // Fetch the tip content
    const tipRef = doc(db, 'recommendations', tipId);
    const tipDoc = await getDoc(tipRef);
    const tipContent = tipDoc.data().tip;
    
        // If the tip doesn't exist, proceed to add it
        const userDocRef = doc(db, 'notificationsdb', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
    
        if (!userDocSnapshot.exists()) {
          console.error('User data not found.');
          return;
        }
    
        const userData = userDocSnapshot.data();
        console.log('userData: ', userData);
        const expoPushToken = userData.token_id;
    
        if (expoPushToken) {
          await sendPushNotification(expoPushToken, tipContent);
          await addDoc(userTipsRef, {
            tipId: tipId,
          });
          console.log('Tip added successfully.');
        } else {
          console.error('No push token available.');
        }
      } catch (error) {
        console.error('Error handling tip:', error);
      }
    };
    

    fetchUserTips();
    checkDailyUsage();

    const intervalId = setInterval(() => {
      fetchUserTips();
      checkDailyUsage();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);

  }, [alertTriggered]);
  const handleAlertTrigger = () => {
    // Update alertTriggered state to trigger re-render
    setAlertTriggered(true);
  };
  return (
    <View style={styles.container}>

      <TopNavBar />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.tipsSection}>
          <Text style={styles.header}>اقتراحات</Text>
          {userTips.map(item => (
            <View key={item.tipId} style={styles.tipItem}>
              <View style={styles.contentContainer}>
                <Text style={styles.tipTitle}>{item.title}</Text>
                <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
              </View>
            </View>
          ))}

      </View>
      </ScrollView>
      <BottomNavBar/>
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: themeColors.bg, // Set background color
  },
  tipsSection:
  {
    margin: 20,
  },
  header: {
    fontSize: 20, // Adjust font size
    fontWeight: 'bold',
    color: '#143638',
    textAlign: 'right', // Align text to the right
    marginBottom: 20,
  },
  tipItem: {
    backgroundColor: themeColors.bg, 
    padding: 20,
    marginBottom: 10,
    borderRadius: 15, // Adjust border radius
    //textAlign: 'right', // Align text to the right
    
  },
  tipTitle: {
    fontSize: 16, // Adjust font size
    textAlign: 'right', // Align text to the right
    color: '#FFFFFF',
   // marginRight: 10,
   //backgroundColor: 'blue', // Set background color
   flex: 1, // Allow the title to expand and fill available space
  },
  contentContainer: {
    //alignItems: 'center',
    //backgroundColor: 'pink', // Set background color
    flexDirection: 'row',

  },
  recommendationIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,

    
  },
});
