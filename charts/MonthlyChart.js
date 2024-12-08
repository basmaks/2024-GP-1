import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const MonthlyChart = ({ apiUrl, selectedUnit }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok || !data.daily_consumption_kWh) {
          throw new Error('Error fetching data');
        }

        const labels = Object.keys(data.daily_consumption_kWh).map(day => `${day}`);
        const datasets = [{
          data: Object.values(data.daily_consumption_kWh).map(val => convertUnits(val)),
        }];

        setChartData({
          labels,
          datasets,
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, selectedUnit]);

  const convertUnits = (value) => {
    switch (selectedUnit) {
      case "واط":
        return value * 1000; // Example: kWh to Watt
      case "أمبير":
        return value * 4.54; // Example conversion
      default:
        return value; // Default is kWh
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00A3FF" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>معدل إستهلاك الكهرباء الشهري ({selectedUnit})</Text>
      {chartData && (
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={280}
          yAxisSuffix={` ${selectedUnit === 'كيلو واط/ساعة' ? 'ك.و.س' : selectedUnit === 'واط' ? 'واط' : 'أمبير'}`}
          chartConfig={styles.chartConfig}
          bezier
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  chartConfig: {
    backgroundColor: '#f2f2f2',
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    fillShadowGradient: '#82c8ff',
    fillShadowGradientOpacity: 0.8,
    color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#00A3FF",
    },
  },
});

export default MonthlyChart;