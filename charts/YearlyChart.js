import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const YearlyChart = ({ selectedUnit }) => {
  const screenWidth = Dimensions.get('window').width;

  // Arabic month names
  const arabicMonths = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  // Mock usage data for each month (April - December has data, June and July have 0 usage)
  const mockUsage = [0, 0, 0, 2.5, 3.0, 0, 0, 30.2, 25.5, 18.6, 22.1, 28.7]; // Example data in kWh

  // Convert data based on selected unit
  const convertUnits = (value) => {
    switch (selectedUnit) {
      case "واط":
        return value * 1000; // kWh to Watt
      case "أمبير":
        return value * 4.54; // Example conversion from kWh to Amp
      default:
        return value; // Default is kWh
    }
  };

  const convertedUsage = mockUsage.map(convertUnits);

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Text style={styles.title}>معدل استهلاك الكهرباء السنوي ({selectedUnit})</Text>
        <LineChart
          data={{
            labels: arabicMonths,
            datasets: [
              {
                data: convertedUsage,
              },
            ],
          }}
          width={screenWidth * 2} // Allow room for scroll
          height={280}
          yAxisSuffix={
            selectedUnit === "كيلو واط/ساعة" ? " ك.و.س" :
            selectedUnit === "واط" ? " واط" :
            " أمبير"
          }
          chartConfig={styles.chartConfig}
          bezier
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  chartConfig: {
    backgroundColor: '#f2f2f2',
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    fillShadowGradient: '#82c8ff',
    fillShadowGradientOpacity: 0.8,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#00A3FF"
    },
    style: {
      borderRadius: 16,
    },
  },
});

export default YearlyChart;
