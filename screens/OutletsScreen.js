import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';
import Outlets_GraphChart from '../charts/Outlets_GraphChart'; 
import { themeColors } from '../theme';

export default function OutletsScreen() {
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [outletConsumption, setOutletConsumption] = useState({}); // Initialize as an empty object
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching

  useEffect(() => {
    const fetchDailyUsage = async () => {
      try {
        // Fetch total daily electricity consumption
        const response = await fetch('http://127.0.0.1:8000/api/v1/data/byDay');
        const totalData = await response.json();
        setTotalConsumption(totalData.total_daily_consumption_kWh);

        // Fetch daily electricity consumption for outlets
        const outletResponse = await fetch('http://127.0.0.1:8000/api/v1/outlets/byDay');
        const outletData = await outletResponse.json();
        setOutletConsumption(outletData.outlet_consumption || {});
      } catch (error) {
        console.error("Error fetching outlet consumption:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchDailyUsage();
  }, []);

  const renderContent = () => {
    return <Outlets_GraphChart />;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جارٍ تحميل البيانات...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopNavBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}

        <View style={styles.lowerContainer}>
          <View style={styles.infoContainer}>

          <View style={styles.todayInfo}>
            <Text style={styles.largeText}>اليوم <Text style={styles.largeUsage}>{totalConsumption.toFixed(4)} <Text style={styles.smallUsage}>ك.و.س</Text></Text></Text>
            <Image source={require('../assets/icons/bolt2.png')} style={styles.boltIcon} />
            </View>

            {/* Display the outlet consumption if available */}
            {outletConsumption && Object.keys(outletConsumption).length > 0 ? (
              Object.keys(outletConsumption).map((outlet, index) => (
                <Text style={styles.infoText} key={index}>
                  <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
                  <Text style={styles.boldText}>مقبس {outlet}:</Text> {outletConsumption[outlet].toFixed(4)} ك.و.س
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>لا يوجد بيانات متاحة للمقابس</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    textAlign: 'right',  // Right-align the content
    
  },
  lowerContainer: {
    //flex: 1,
    backgroundColor: '#143638',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  infoContainer: {  // Add this style
    justifyContent: 'flex-end', // Align content to the end (right)
    alignItems: 'flex-end', // Align content to the end (right)
  },


//whats inside the todayInfo div cuz of the bolt icon and many texts
todayInfo: {
  marginTop: 5,
  marginBottom: 30,
  flexDirection: 'row',
  justifyContent: 'space-between', // Adjusted justifyContent
},
largeText: {
  color: themeColors.lightb,
  fontSize: 20,
  fontWeight: 'bold',
},
  largeUsage: {
    color: themeColors.lightb,
    fontSize: 20,
  },
  smallUsage: {
    color: themeColors.lightb,
    fontSize: 20,
  },
  boltIcon: {
    width: 22,
    height: 22,
    alignSelf: 'flex-end',
  },
  //end of todayInfo

  infoText: {
    color: 'white',
    fontSize: 16,
    paddingBottom: 10,
    marginBottom: 10,
  },

  icon: {
    width: 20,
    height: 22,
    marginRight: 5,
  },
  boldText: {
    fontWeight: 'bold',  // Make "مقبس" bold
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
  },

});