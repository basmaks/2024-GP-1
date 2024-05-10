//Kwh_FilterChart.js

import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment'; // Make sure moment is imported

const formatDate = (dateString) => {
  return moment(dateString).format('DD/MM/YYYY'); // Example format
};

const Kwh_FilterChart = ({ chartData, startDate, endDate }) => {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data available for the selected period.</Text>
      </View>
    );
  }

  const labels = chartData.map(data => data.date);
  const values = chartData.map(data => data.usage);

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
        yAxisLabel=""
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


/* 3:29 AM code 
import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const FilterChart = ({ chartData }) => {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data available for the selected period.</Text>
      </View>
    );
  }

  const labels = chartData.map(data => data.date);
  const values = chartData.map(data => data.usage);
  const formatDate = date => date.toLocaleDateString('ar-EG'); // Format date in a regional appropriate format

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        معدل استهلاك الكهرباء بين {formatDate(new Date(startDate))} و {formatDate(new Date(endDate))}
      </Text>
      <Text style={styles.header}>Electricity Usage Over Time</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: values }],
        }}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kWh"
        chartConfig={{
          backgroundColor: '#f2f2f2',
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
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default FilterChart; */


/* import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const FilterChart = ({ chartData }) => {
  // Ensure data is in the right format
  const labels = chartData.map(data => data.date);
  const values = chartData.map(data => data.usage);

  if (!chartData || !Array.isArray(chartData)) {
    return <View style={styles.container}><Text style={styles.text}>Error from FilterChart.js: No data available for the selected period.</Text></View>;
  }


  // Check if data is available
  if (values.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data available for the selected period.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Electricity Usage Over Time</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{
            data: values,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }]
        }}
        width={Dimensions.get('window').width - 30} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kWh"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 6, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726'
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
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default FilterChart; */