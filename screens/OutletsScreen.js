import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { themeColors } from '../theme';
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';
import Outlets_GraphChart from '../charts/Outlets_GraphChart'; 

export default function OutletsScreen() {
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [outletConsumption, setOutletConsumption] = useState({}); // Initialize as an empty object
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching

  useEffect(() => {
    const userId = "318787"; // Replace with dynamic user ID if needed

    // Fetch total daily electricity consumption
    fetch(`http://127.0.0.1:8000/data/byDay?user_id=${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Total consumption data:", data); // Log the response
        setTotalConsumption(data.total_daily_consumption_kWh);
      })
      .catch(error => console.error("Error fetching total consumption:", error));

    // Fetch daily electricity consumption for outlets
    fetch(`http://127.0.0.1:8000/outlets/byDay?user_id=${userId}`)
      .then(response => {
        console.log("Raw response:", response); // Log the raw response
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Parse JSON only if content-type is application/json
        } else {
          throw new Error('Unexpected response format'); // Handle unexpected response
        }
      })
      .then(data => {
        console.log("Outlet consumption data:", data); // Log the parsed data
        setOutletConsumption(data.outlet_consumption || {}); // Use an empty object if data is missing
        setLoading(false); // Data fetching complete
      })
      .catch(error => {
        console.error("Error fetching outlet consumption:", error);
        setLoading(false); // Stop loading even if there’s an error
      });
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
            <Text style={styles.largeText}>
              <Image source={require('../assets/icons/bolt2.png')} style={styles.boltIcon} />
              اليوم <Text style={styles.largeUsage}>{totalConsumption} <Text style={styles.smallUsage}>ك.و.س</Text></Text>
            </Text>

            {/* Ensure outletConsumption is defined and has keys before rendering */}
            {outletConsumption && Object.keys(outletConsumption).length > 0 ? (
              Object.keys(outletConsumption).map((outlet, index) => (
                <Text style={styles.infoText} key={index}>
                  <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
                  مقبس {outlet}: <Text style={styles.infoText}>{outletConsumption[outlet]} ك.و.س</Text>
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>لا يوجد بيانات المتاحة للمقابس</Text>
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
    textAlign: 'left',
  },
  lowerContainer: {
    flex: 1,
    backgroundColor: '#143638',
    paddingHorizontal: 20,
    marginTop: 10,
    textAlign: 'left',
  },
  largeText: {
    color: themeColors.lightb,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    paddingBottom: 15,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    paddingBottom: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  largeUsage: {
    color: themeColors.lightb,
    fontSize: 26,
    marginBottom: 10,
    textAlign: 'left',
    paddingBottom: 15,
  },
  smallUsage: {
    color: themeColors.lightb,
    fontSize: 17,
    marginBottom: 10,
    textAlign: 'left',
    paddingBottom: 15,
  },
  boltIcon: {
    width: 35,
    height: 35,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  icon: {
    width: 20,
    height: 22,
    marginRight: 5,
    alignSelf: 'flex-end',
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