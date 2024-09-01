/*import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const RealTimeBarChart = () => {
  const [data, setData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
    }],
  });

  useEffect(() => {
    // Here we should modify and connect the data, i'll leave the code as comment
    const subscription = subscribeToRealTimeData((newData) => {
      // Update graph data with new data
      const updatedData = { ...data };
      const dayOfWeek = new Date(newData.timestamp).getDay(); // 0 for Sunday, 1 for Monday, etc.
      updatedData.datasets[0].data[dayOfWeek] += newData.value;
      setData(updatedData);
    });

    // Unsubscribe when component unmounts
    return () => {
      unsubscribeFromRealTimeData(subscription);
    };
  }, []);

  return (
    <View>
      <BarChart
        data={data}
        width={300}
        height={200}
        yAxisLabel="kWh"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        verticalLabelRotation={30}
      />
    </View>
  );
};

#^ Basma's comment.

##################################

export default RealTimeBarChart;*/
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { themeColors } from '../theme';

const RealTimeBarChart = () => {
  const [data, setData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [10, 20, 30, 40, 50, 60, 70], // Dummy consumption data
    }],
  });

  useEffect(() => {
    // Simulate subscription to real-time data source (replace with actual logic)
    const interval = setInterval(() => {
      // Generate random data for demonstration
      const newData = {
        timestamp: new Date(),
        value: Math.floor(Math.random() * 100) + 1, // Generate random consumption value
      };
      const updatedData = { ...data };
      const dayOfWeek = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.
      updatedData.datasets[0].data[dayOfWeek] = newData.value;
      setData(updatedData);
    }, 5000); // Update every 5 seconds

    // Unsubscribe when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={300}
        height={200}
        yAxisLabel="kWh"
        chartConfig={{
          backgroundColor: '#ffffff', // Set background color to white
          backgroundGradientFrom: '#ffffff', // Background gradient start color
          backgroundGradientTo: '#ffffff', // Background gradient end color
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(130, 200, 255, ${opacity})`, // Set bar color to light blue
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
          style: {
            borderRadius: 16,
          },
        }}
        verticalLabelRotation={30}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default RealTimeBarChart;
    
   
