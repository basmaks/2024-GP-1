//AnalyticsScreen.js

import React, { useState } from "react"; 
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native'
import * as Icons from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import TopNavBar from "../navigation/TopNavBar";
import BottomNavBar from "../navigation/BottomNavBar";
import SelectorBar from "../components/SelectorBar"; 
import ProgressBar from "../components/CustomProgressBar";
import Gauge from "../components/Gauge";
import DateRangePicker from '../components/DateRangePicker'



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

export default function AnalyticsScreen() {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(4); // 'مباشر' as default
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(2); // 'كيلو واط/ساعة' as default
  const periodOptions = ["مخصص","سنة", "شهر", "أسبوع", "يوم", "مباشر"];
  const unitOptions = ["أمبير", "واط", "كيلو واط/ساعة"];
  const [showDatePicker, setShowDatePicker] = useState(false); // State for showing date picker
  const [startDate, setStartDate] = useState(new Date()); // Start date for date range filter
  const [endDate, setEndDate] = useState(new Date()); 

  const renderChartComponent = () => {
    let chartComponent = null; // Default to null if no match
  
    // Match the period with the unit for appropriate graph
    switch (periodOptions[selectedPeriodIndex]) {
      case "مباشر":
        switch (unitOptions[selectedUnitIndex]) {
          case "كيلو واط/ساعة":
            chartComponent = <Kwh_RealTimeChart apiUrl="http://127.0.0.1:5000/api/getRecentUsage" />;
            break;
          case "واط":
            chartComponent = <W_RealTimeChart apiUrl="http://127.0.0.1:5000/api/getRecentUsage" />;
            break;
          case "أمبير":
            chartComponent = <Amp_RealTimeChart apiUrl="http://127.0.0.1:5000/api/getRecentUsage" />;
            break;
        }
        break;
      case "يوم":
        switch (unitOptions[selectedUnitIndex]) {
          case "كيلو واط/ساعة":
            chartComponent = <Kwh_DailyChart />;
            break;
          case "واط":
            chartComponent = <W_DailyChart />;
            break;
          case "أمبير":
            chartComponent = <Amp_DailyChart />;
            break;
        }
        break;
      case "أسبوع":
        switch (unitOptions[selectedUnitIndex]) {
          case "كيلو واط/ساعة":
            chartComponent = <Kwh_WeeklyChart />;
            break;
          case "واط":
            chartComponent = <W_WeeklyChart />;
            break;
          case "أمبير":
            chartComponent = <Amp_WeeklyChart />;
            break;
        }
        break;
      case "شهر":
        switch (unitOptions[selectedUnitIndex]) {
          case "كيلو واط/ساعة":
            chartComponent = <Kwh_MonthlyChart />;
            break;
          case "واط":
            chartComponent = <W_MonthlyChart />;
            break;
          case "أمبير":
            chartComponent = <Amp_MonthlyChart />;
            break;
        }
        break;
      case "سنة":
        switch (unitOptions[selectedUnitIndex]) {
          case "كيلو واط/ساعة":
            chartComponent = <Kwh_YearlyChart />;
            break;
          case "واط":
            chartComponent = <W_YearlyChart />;
            break;
          case "أمبير":
            chartComponent = <Amp_YearlyChart />;
            break;
        }
        break;
        case "مخصص":
        switch (unitOptions[selectedUnitIndex]) {
          case "كيلو واط/ساعة":
            chartComponent = <Kwh_YearlyChart />;
            break;
          case "واط":
            chartComponent = <W_YearlyChart />;
            break;
          case "أمبير":
            chartComponent = <Amp_YearlyChart />;
            break;
        }
        break;
      default:
        chartComponent = <Text>غير متاح</Text>;
    }
  
    return chartComponent;
  };  
  
  const fuelLevel = 75;
  return (
    <View style={styles.container}>
      <TopNavBar />
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.goalIntro}>
        <Image source={require('../assets/icons/editGoal.png')} style={styles.editIcon} />
        <Text style={styles.goalText}>تابع تقدمك نحو هدفك!</Text>
        </View>
      
      <View style={styles.goalContainer}>
      <Text style={styles.goalDescription}>
          هدفك هو تقليل فاتورتك إلى{' '}
          <Text style={{ fontWeight: 'bold' }}>900 ريال سعودي،</Text>{' '}
          مما {' '}
          <Text style={{ fontWeight: 'bold'}}>يوفر 100 ريال سعودي</Text>{' '}
         مقارنة بفاتورة الشهر الماضي التي بلغت <Text style={{ fontWeight: 'bold' }}>1000</Text> ريال سعودي.
        </Text>

          <ProgressBar current={500} target={900} style={{ width: 300 }} />


        </View>
        <View style={styles.dataContainer2}>
        <View style={styles.ContainerText}>
        <Text style={styles.conDescription}>
        نظرة على إستهلاكك لهذا الشهر:
          </Text>
          <Text style={styles.conDescription2}>
        الفترة: الأحد, 1 مارس حتى الإثنين 25 مارس 2024
</Text>
          </View>
 <View style={styles.dataContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}> تقدير الفاتورة</Text>
              <Text style={styles.largeInfo}>500</Text>
              <Text style={styles.infoText}>ريال سعودي</Text>
            </View>
            <View style={styles.infoBox}>
  <Text style={styles.infoText}>الاستهلاك </Text>
  <Image source={require('../assets/icons/meter.png')} style={styles.meterIcon} />
  <View style={styles.textBelowGauge}>
  <Text style={styles.textBelowGaugeText}>منخفض</Text>
      <Text style={styles.textBelowGaugeText}>عالي</Text>
    </View>
</View>
          </View>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>إستهلاك الشهر</Text>
              <Text style={styles.largeInfo}>168</Text>
              <Text style={styles.infoText}>كيلو واط/ساعة</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>إستهلاك اليوم</Text>
              <Text style={styles.largeInfo}>17</Text>
              <Text style={styles.infoText}>كيلو واط/ساعة</Text>
            </View>
          </View>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
            <Text style={{ textAlign: 'right', color: 'white', fontSize: 16 }}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>أعلى</Text> استهلاك للكهرباء كان في يوم <Text style={{ fontWeight: 'bold', fontSize: 21, color: '#82C7FA' }}>الجمعة </Text> 
            الموافق <Text style={{ color: '#fff', fontSize: 14, fontWeight:'bold'}}>15 مارس، 2024</Text>
            </Text>
            </View>
            <View style={styles.infoBox}>
            <Text style={{ textAlign: 'right', color: 'white', fontSize: 16 }}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>أقل</Text> استهلاك للكهرباء كان في يوم <Text style={{ fontWeight: 'bold', fontSize: 21, color: '#82C7FA' }}>الأحد </Text> 
            الموافق <Text style={{ color: '#fff', fontWeight:'bold'}}>3 مارس، 2024</Text>
            </Text>
            </View>
          </View>
        </View></View>
        <View style={styles.ContainerText}>
        <Text style={styles.conDescription3}>
        تحليل استهلاك الكهرباء حسب الفترة والوحدة:
          </Text>
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
{showDatePicker && (
  <View>
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onChangeStartDate={(event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setStartDate(selectedDate);
        }
      }}
      onChangeEndDate={(event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setEndDate(selectedDate);
        }
      }}
    />
  </View>
)}
        <View style={{ marginTop: 0,}}>
          <Text style={styles.rightAlignedLabel}>الوحدة</Text>
          <SelectorBar
            options={unitOptions}
            selectedIndex={selectedUnitIndex}
            onSelect={setSelectedUnitIndex}
          />
        </View>
        
        <View style={styles.chartContainer}>
          {renderChartComponent()} 
        </View >

      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#ffffff", no need
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

  },ContainerText:{
   
    marginHorizontal:20,
  },
  conDescription:{
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    textAlign: 'right',
    fontWeight: '600',
    
  },
  conDescription2:{
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'right',
    fontWeight: '400',

  }, 
  conDescription3:{
    fontSize: 16,
    color: '#000',
    marginTop: 30,
    textAlign: 'right',
    fontWeight: '600',
    
  },
  dataContainer2: {// كله ماله داعي شوي
    //backgroundColor: 'rgba(192, 192, 192, 0.4)',
   marginHorizontal: "auto",
    borderRadius: 20,
    //padding: 20,
   marginTop:10,
   
  },
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 2,
    
  },
  infoBox: {
    flex: 1,
    padding: 25,
    borderRadius: 20,
    backgroundColor: "#143638",
    margin: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  infoText1:{
    color: "#fff",
    fontSize: 16,
    textAlign: "right",
  },
  largeInfo: {
    color: "#82C7FA",
    fontSize: 36,
    textAlign: "center",
    fontWeight: '600',
  },
  chartContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    marginTop: 0,
  },
  chartHeaderText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 0,
  },
  scrollViewStyle:{
    
  },
  goalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
    textAlign: 'right',
    //marginHorizontal: 20,
    color: '#143638', 

  },
  goalContainer: {
    backgroundColor: 'rgba(192, 192, 192, 0.4)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  goalDescription: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'right',
  },
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
    width:70,
    height:50,
    alignSelf: 'center'
  },

  editIcon: {
    width:30,
    height:30,
    alignSelf: 'center',
    marginLeft:130


  },
goalIntro:{
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  marginHorizontal: 20,
}
});