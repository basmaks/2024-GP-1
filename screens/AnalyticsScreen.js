import React, { useState, useEffect } from "react"; 
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as Icons from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth"; 
import { auth } from "../config/firebase";
import TopNavBar from "../navigation/TopNavBar";
import BottomNavBar from "../navigation/BottomNavBar";
import SelectorBar from "../components/SelectorBar"; 
import CustomProgressBar from "../components/CustomProgressBar";
import Gauge from "../components/Gauge";
import DateRangePicker from '../components/DateRangePicker';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

// Import chart components
import Kwh_RealTimeChart from "../charts/Kwh_RealTimeChart";
import W_RealTimeChart from "../charts/W_RealTimeChart";
import Amp_RealTimeChart from "../charts/Amp_RealTimeChart";
import Kwh_DailyChart from "../charts/Kwh_DailyChart";
import W_DailyChart from "../charts/W_DailyChart";
import Amp_DailyChart from "../charts/Amp_DailyChart";
import Kwh_WeeklyChart from "../charts/Kwh_WeeklyChart";
import W_WeeklyChart from "../charts/W_WeeklyChart";
import Amp_WeeklyChart from "../charts/Amp_WeeklyChart";
import Kwh_MonthlyChart from "../charts/Kwh_MonthlyChart";
import W_MonthlyChart from "../charts/W_MonthlyChart";
import Amp_MonthlyChart from "../charts/Amp_MonthlyChart";
import Kwh_YearlyChart from "../charts/Kwh_YearlyChart";
import W_YearlyChart from "../charts/W_YearlyChart";
import Amp_YearlyChart from "../charts/Amp_YearlyChart";
import Kwh_FilterChart from '../charts/Kwh_FilterChart';
import Amp_FilterChart from '../charts/Amp_FilterChart';
import W_FilterChart from '../charts/W_FilterChart';
import DailyChart from "../charts/DailyChart";

import GoalComponent from "../components/GoalComponent"; // Import GoalComponent

export default function AnalyticsScreen() {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(5); // 'مباشر' as default
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(2); // 'كيلو واط/ساعة' as default
  const periodOptions = ["مخصص", "سنة", "شهر", "أسبوع", "يوم", "مباشر"];
  const unitOptions = ["أمبير", "واط", "كيلو واط/ساعة"];
  const [showDatePicker, setShowDatePicker] = useState(false); // State for showing date picker
  const [startDate, setStartDate] = useState(new Date()); // Start date for date range filter
  const [endDate, setEndDate] = useState(new Date()); 
  const [chartData, setChartData] = useState([]);
  const [monthlyConsumption, setMonthlyConsumption] = useState(0); // Monthly consumption
  const [dailyConsumption, setDailyConsumption] = useState(0); // Daily consumption
  const [classification, setClassification] = useState(""); // Consumption classification (Low, Average, High)
  const [userId] = useState("318787"); // Static userId for electricity_usage (shared)
  const [monthlyCost, setMonthlyCost] = useState(0); // Monthly cost
  const [highestDay, setHighestDay] = useState('');
  const [lowestDay, setLowestDay] = useState('');
  const [highestConsumption, setHighestConsumption] = useState(0);
  const [lowestConsumption, setLowestConsumption] = useState(0);
  const today = new Date();
  const firstDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
  const secondDate = today; 

  // Fetch monthly and daily consumption when component mounts
  useEffect(() => {
    fetchMonthlyConsumption(userId);
    fetchDailyConsumption(userId); // Added this for daily consumption
  }, [userId]);

  useEffect(() => {
    fetchConsumptionRange();
  }, []);

  const fetchDataAndAggregate = async (startDate, endDate) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/data/aggregateData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setChartData(data.data); // Update your state with the received data
    } catch (error) {
      console.error('Failed to fetch aggregated data:', error);
    }
  };
  


// Fetch monthly consumption and cost
const fetchMonthlyConsumption = async (sharedUserId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const response = await fetch(`http://127.0.0.1:8000/api/v1/data/byMonth?user_id=${sharedUserId}&month=${currentMonth}`);
    const data = await response.json();
    setMonthlyConsumption(data.total_monthly_consumption_kWh);
    setClassification(data.classification); // Store Low/Average/High classification
    setMonthlyCost(data.total_cost_sar); // Store the calculated cost
  } catch (error) {
    console.error('Error fetching monthly consumption:', error);
  }
};

  // Fetch daily consumption
  const fetchDailyConsumption = async (sharedUserId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/data/byDay?user_id=${sharedUserId}`);
      const data = await response.json();
      setDailyConsumption(data.total_daily_consumption_kWh);
    } catch (error) {
      console.error('Error fetching daily consumption:', error);
    }
  };

  // Fetch highest and lowest consumption data
  const fetchConsumptionRange = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/data/consumption_range');
      const data = await response.json();

      // Update state with values from the API response
      setHighestDay(data.highest_day);  // Arabic-formatted day and date
      setLowestDay(data.lowest_day);    // Arabic-formatted day and date
      setHighestConsumption(data.highest_consumption_kWh);  // Already rounded by backend
      setLowestConsumption(data.lowest_consumption_kWh);    // Already rounded by backend
    } catch (error) {
      console.error('Error fetching consumption range:', error);
    }
  };

  const handleDateSelection = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    fetchDataAndAggregate(start, end);
    setShowDatePicker(false); // Hide the picker after date selection
  };

  const renderChartComponent = () => {
    let chartComponent = null; // Default to null if no match

    // Match the period with the unit for appropriate graph
    switch (periodOptions[selectedPeriodIndex]) {
      case "مباشر":
        chartComponent = (
          unitOptions[selectedUnitIndex] === "كيلو واط/ساعة" ? <Kwh_RealTimeChart apiUrl="http://127.0.0.1:8000/api/v1/data/bySecond" /> :
          unitOptions[selectedUnitIndex] === "واط" ? <W_RealTimeChart apiUrl="http://127.0.0.1:8000/api/v1/data/bySecond" /> :
          unitOptions[selectedUnitIndex] === "أمبير" ? <Amp_RealTimeChart apiUrl="http://127.0.0.1:8000/api/v1/data/bySecond" /> : null
        );
        break;
      case "يوم":
        chartComponent = (
          unitOptions[selectedUnitIndex] === "كيلو واط/ساعة" ? <DailyChart apiUrl="http://127.0.0.1:8000/api/v1/data/byHour" /> :
          unitOptions[selectedUnitIndex] === "واط" ? <DailyChart apiUrl="http://127.0.0.1:8000/api/v1/data/byHour" /> :
          unitOptions[selectedUnitIndex] === "أمبير" ? <DailyChart apiUrl="http://127.0.0.1:8000/api/v1/data/byHour" /> : null
        );
        break;
      case "أسبوع":
        chartComponent = (
          unitOptions[selectedUnitIndex] === "كيلو واط/ساعة" ? <Kwh_WeeklyChart /> :
          unitOptions[selectedUnitIndex] === "واط" ? <W_WeeklyChart /> :
          unitOptions[selectedUnitIndex] === "أمبير" ? <Amp_WeeklyChart /> : null
        );
        break;
      case "شهر":
        chartComponent = (
          unitOptions[selectedUnitIndex] === "كيلو واط/ساعة" ? <Kwh_MonthlyChart /> :
          unitOptions[selectedUnitIndex] === "واط" ? <W_MonthlyChart /> :
          unitOptions[selectedUnitIndex] === "أمبير" ? <Amp_MonthlyChart /> : null
        );
        break;
      case "سنة":
        chartComponent = (
          unitOptions[selectedUnitIndex] === "كيلو واط/ساعة" ? <Kwh_YearlyChart /> :
          unitOptions[selectedUnitIndex] === "واط" ? <W_YearlyChart /> :
          unitOptions[selectedUnitIndex] === "أمبير" ? <Amp_YearlyChart /> : null
        );
        break;
      case "مخصص": 
        chartComponent = (
          unitOptions[selectedUnitIndex] === "كيلو واط/ساعة" ? <Kwh_FilterChart chartData={chartData} startDate={startDate} endDate={endDate} /> :
          unitOptions[selectedUnitIndex] === "واط" ? <W_FilterChart chartData={chartData} startDate={startDate} endDate={endDate} /> :
          unitOptions[selectedUnitIndex] === "أمبير" ? <Amp_FilterChart chartData={chartData} startDate={startDate} endDate={endDate} /> : null
        );
        break;
    }

    return chartComponent;
  };

  return ( 
    <View style={styles.container}>
      <TopNavBar />
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.dataContainer2}>
          <View style={styles.ContainerText}>
            <Text style={styles.conDescription}>نظرة على إستهلاكك لهذا الشهر:</Text>
            <Text style={styles.conDescription2}>
              من {firstDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
              {' '}حتى {secondDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          <View style={styles.dataContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}> تقدير الفاتورة</Text>
                <Text style={styles.largeInfo}>{monthlyCost}</Text>
                <Text style={styles.infoText}>ريال سعودي</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>الاستهلاك</Text>
                <Image source={require('../assets/icons/meter.png')} style={styles.meterIcon} />
                <View style={styles.textBelowGauge}>
                  <Text style={styles.textBelowGaugeText}>
                    {classification === "Low" ? "منخفض" : classification === "Average" ? "متوسط" : "مرتفع"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.dataContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>إستهلاك الشهر</Text>
                <Text style={styles.largeInfo}>{monthlyConsumption}</Text>
                <Text style={styles.infoText}>كيلو واط/ساعة</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>إستهلاك اليوم</Text>
                <Text style={styles.largeInfo}>{dailyConsumption}</Text>
                <Text style={styles.infoText}>كيلو واط/ساعة</Text>
              </View>
            </View>
          </View>

          <View style={styles.dataContainer}>
          <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={{ textAlign: 'right', color: 'white', fontSize: 16 }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>أعلى</Text> استهلاك للكهرباء كان في يوم{' '}
              <Text style={{ fontWeight: 'bold', fontSize: 21, color: '#82C7FA' }}>
                {highestDay ? highestDay.split(",")[0] : ''}
              </Text>{' '}
              الموافق <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                {highestDay ? highestDay.split(",")[1] : ''}
              </Text>{' '}
              بمعدل <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                {highestConsumption} كيلو واط/ساعة
              </Text>
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={{ textAlign: 'right', color: 'white', fontSize: 16 }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>أقل</Text> استهلاك للكهرباء كان في يوم{' '}
              <Text style={{ fontWeight: 'bold', fontSize: 21, color: '#82C7FA' }}>
                {lowestDay ? lowestDay.split(",")[0] : ''}
              </Text>{' '}
              الموافق <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {lowestDay ? lowestDay.split(",")[1] : ''}
              </Text>{' '}
              بمعدل <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                {lowestConsumption} كيلو واط/ساعة
              </Text>
            </Text>
          </View>
      </View> 
   </View> 
</View>
        {/* GoalComponent */}
        <View style={styles.dataContainer2}>
          {userId ? <GoalComponent userId={userId} /> : null}
        </View>
        <View style={styles.ContainerText}>
          <Text style={styles.conDescription3}>تحليل استهلاك الكهرباء حسب الفترة والوحدة:</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.rightAlignedLabel}>الفترة</Text>
          <SelectorBar
            options={periodOptions}
            selectedIndex={selectedPeriodIndex}
            onSelect={(index) => {
              setSelectedPeriodIndex(index);
              if (periodOptions[index] === "مخصص") {
                setShowDatePicker(true); // Show date picker when "مخصص" is selected
              } else {
                setShowDatePicker(false); // Hide date picker for other options
              }
            }}
          />
        </View>

        {showDatePicker ? (
          <View>
            <DateRangePicker
                onDatesSelected={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    fetchDataAndAggregate(start, end);  // Call to fetch the aggregated data
                }}
            />
          </View>
        ) : null}

        <View style={{ marginTop: 0 }}>
          <Text style={styles.rightAlignedLabel}>الوحدة</Text>
          <SelectorBar
            options={unitOptions}
            selectedIndex={selectedUnitIndex}
            onSelect={setSelectedUnitIndex}
          />
        </View>

        <View style={styles.chartContainer}>
          {renderChartComponent()} 
        </View>

      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightAlignedLabel: {
    alignSelf: "flex-end",
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  dataContainer: {
    paddingBottom: 0,
  },
  ContainerText: {
    marginHorizontal: 20,
  },
  conDescription: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
    marginTop: 10,
    textAlign: 'right',
    fontWeight: '600',
  },
  conDescription2: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'right',
    fontWeight: '400',
  },
  conDescription3: {
    fontSize: 16,
    color: '#000',
    marginTop: 30,
    textAlign: 'right',
    fontWeight: '600',
  },
  dataContainer2: {
    borderRadius: 20,
    marginTop: 10,
  },
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  infoBox: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#143638",
    margin: 10,
    height: 150, // Fixed height to ensure equal size
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    aspectRatio: 1, // Ensures a square box
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  largeInfo: {
    color: "#82C7FA",
    fontSize: 30,
    textAlign: "center",
    fontWeight: '600',
  },
  chartContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    marginTop: 0,
  },
  scrollViewStyle: {},
  textBelowGauge: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  textBelowGaugeText: {
    color: "#fff",
    fontSize: 14,
  },
  meterIcon: {
    width: 70,
    height: 50,
    alignSelf: 'center',
  },
});
