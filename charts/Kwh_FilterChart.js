// Kwh_FilterChart.js

import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment'; 

const formatDate = (dateString) => {
  return moment(dateString).format('DD/MM/YYYY'); 
};

const Kwh_FilterChart = ({ chartData, startDate, endDate }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>جاري إحضار البيانات..</Text>
      </View>
    );
  }

  const labels = chartData.map(data => data.date);  // Dates for the x-axis
  const values = chartData.map(data => data.usage);  // Usage for the y-axis

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        معدل إستهلاك الكهرباء 
      </Text>
      <Text style={styles.header2}>
        من {formatDate(startDate)} إلى {formatDate(endDate)}
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: values }],
        }}
        width={Dimensions.get('window').width - 10}
        height={230}
        yAxisSuffix=" ك.و.س"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f2f2f2',
          backgroundGradientTo: '#f2f2f2',
          fillShadowGradient: '#82c8ff', 
          fillShadowGradientOpacity: 0.8,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#00A3FF'
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 30,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  header2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000000',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
});

export default Kwh_FilterChart;