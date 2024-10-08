// Amp_FilterChart.js

import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment'; 

const formatDate = (dateString) => {
  return moment(dateString).format('DD/MM/YYYY'); 
};

const Amp_FilterChart = ({ chartData, startDate, endDate }) => {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>جاري إحضار البيانات..</Text>
      </View>
    );
  }

  const voltage = 240; // Voltage in volts
  const labels = chartData.map(data => data.date);
  const values = chartData.map(data => (data.usage * 1000) / voltage); // Convert kWh to Amps

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        معدل إستهلاك الكهرباء بالأمبير
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
        yAxisLabel=""
        yAxisSuffix=" A"
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

export default Amp_FilterChart;
