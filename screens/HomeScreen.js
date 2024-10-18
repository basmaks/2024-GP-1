import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';
import { themeColors } from '../theme';
import * as Icons from "react-native-heroicons/solid";
import SelectorBar from '../components/SelectorBar';
import Kwh_RealTimeChart from '../charts/Kwh_RealTimeChart';
import Kwh_DailyChart from '../charts/Kwh_DailyChart';
import Kwh_WeeklyChart from '../charts/Kwh_WeeklyChart';
import Kwh_MonthlyChart from '../charts/Kwh_MonthlyChart';
import Kwh_YearlyChart from '../charts/Kwh_YearlyChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getFirestore, where, getDocs, addDoc, updateDoc, setDoc, doc } from 'firebase/firestore';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [dailyConsumption, setDailyConsumption] = useState(0); // State for daily consumption
  const [dailyCost, setDailyCost] = useState(0); // State for daily cost
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(4); // Default selector bar choice is مباشر
  const options = ['سنة', 'شهر', 'أسبوع', 'يوم', 'مباشر'];

  // Mapping for selector display
  const displayTextMapping = {
    0: 'معدل استهلاك الكهرباء لسنة 2024\n(كيلو واط/ساعة)',
    1: 'معدل استهلاك الكهرباء لشهر مايو 2024\n(كيلو واط/ساعة)',
    2: 'معدل استهلاك الكهرباء الأسبوعي \n من الأحد 12/5/2024 إلى السبت 18/5/2024 \n (كيلو واط/ساعة)',
    3: ` معدل استهلاك الكهرباء يوم الأربعاء 15/5/2024 \n (كيلو واط/ساعة)`,
    4: 'معدل استهلاك الكهرباء المباشر\n(كيلو واط/ساعة)'
  };

  const getDisplayText = (index) => displayTextMapping[index];

  const fetchDailyConsumptionAndCost = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/data/byDay');
      const data = await response.json();
  
      if (data.total_daily_consumption_kWh !== undefined && data.daily_cost_sar !== undefined) {
        setDailyConsumption(data.total_daily_consumption_kWh);
        setDailyCost(data.daily_cost_sar); // Use the cost returned from the API
      }
    } catch (error) {
      console.error('Error fetching daily consumption and cost:', error);
    }
  };
  

  const saveToken = async () => {
    let user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found!');
      return;
    }
    let token = await AsyncStorage.getItem('token');
    const userDocRef = doc(db, 'notificationsdb', user.uid); // Create a reference to the specific document for the user

    try {
      await setDoc(userDocRef, {
        notifications: 0,
        uid: user.uid,
        token_id: token
      }, { merge: true }); // Use setDoc with merge option to update or create the document
      console.info('Token saved successfully!');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  useEffect(() => {
    saveToken();
    fetchDailyConsumptionAndCost(); 

    const updateDateAndTime = () => {
      const now = new Date();
      const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const day = daysOfWeek[now.getDay()];
      const date = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const hours = now.getHours();
      const min = now.getMinutes().toString().padStart(2, '0');
      const sec = now.getSeconds().toString().padStart(2, '0');
      setCurrentDate(
        `التاريخ: ${day}، ${date}/${month}/${year}`
      );
      setCurrentTime(
        `    الوقت: ${hours}:${min}:${sec}`
      );
    };

    updateDateAndTime();
    const timeIntervalId = setInterval(updateDateAndTime, 1000); // Updates time every second. 1000ms = 1s

    return () => clearInterval(timeIntervalId);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TopNavBar />
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.upperContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateStyle}>{currentDate}{currentTime}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>التكلفة</Text>
              <Text style={styles.largeInfo}>{dailyCost}</Text>
              <Text style={styles.infoText}>ريال سعودي</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>اليوم</Text>
              <Text style={styles.largeInfo}>{dailyConsumption}</Text>
              <Text style={styles.infoText}>كيلو واط / ساعة</Text>
            </View>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          <SelectorBar
            options={options}
            selectedIndex={selectedOptionIndex}
            onSelect={(index) => {
              setSelectedOptionIndex(index);
            }}
          />
          <Text style={styles.chartHeaderText}>
            {getDisplayText(selectedOptionIndex)}
          </Text>
          {selectedOptionIndex === 4 && <Kwh_RealTimeChart apiUrl="http://127.0.0.1:8000/data/bySecond" />}
          {selectedOptionIndex === 3 && <Kwh_DailyChart />}
          {selectedOptionIndex === 2 && <Kwh_WeeklyChart />}
          {selectedOptionIndex === 1 && <Kwh_MonthlyChart />}
          {selectedOptionIndex === 0 && <Kwh_YearlyChart />}
        </View>
        <View style={styles.outletsBox}>
          <TouchableOpacity onPress={() => navigation.navigate('Outlets')}>
            <Text style={styles.outletsText}>متابعة استهلاك المقابس الكهربائية</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  upperContainer: {
    backgroundColor: '#143638',
    paddingBottom: 15,
  },
  lowerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    marginTop: 0,
  },
  dateContainer: {
    alignItems: 'center',
    width: "100%",
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(192, 192, 192, 0.4)',
    borderRadius: 32,
    maxWidth: 346,
    alignSelf: 'center',
  },
  dateStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 2,
  },
  infoBox: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(192, 192, 192, 0.4)',
    margin: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  outletsBox: {
    borderRadius: 20,
    backgroundColor: themeColors.lightb,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 50,
    marginTop: 0,
    marginBottom: 30,
    maxWidth: 346,
    alignSelf: 'center',
  },
  outletsText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
  largeInfo: {
    fontSize: 36,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  chartHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
});
