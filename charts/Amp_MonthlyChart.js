import React from 'react';
import { ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const Amp_MonthlyChart = () => {
  const voltage = 230; // Assumed voltage
  const hoursInDay = 24; // Hours in a day

  // Convert kWh to Amps
  const convertedData = [22, 50, 33, 22, 35, 18, 11, 5, 14, 6, 12, 14, 22, 48, 33, 22, 35, 18, 11, 5, 7, 6, 12, 14, 24].map(kWh => kWh ? (kWh * 1000) / (voltage * hoursInDay) : null);

  const chartData = {
    labels: ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢', '١٣', '١٤', '١٥', '١٦', '١٧', '١٨', '١٩', '٢٠', '٢١', '٢٢', '٢٣', '٢٤', '٢٥', '٢٦', '٢٧', '٢٨', '٢٩', '٣٠', '٣١'],
    datasets: [{
      data: convertedData
    }]
  };

  const chartWidth = 12 * 60; // Adjust if needed

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        <BarChart
          data={chartData}
          width={chartWidth} 
          height={280}
          yAxisLabel=""
          yAxisSuffix=" A" 
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            fillShadowGradient: '#82c8ff', 
            fillShadowGradientOpacity: 1,
            decimalPlaces: 2, 
            color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            barPercentage: 0.5,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero
        />
      </View>
    </ScrollView>
  );
};

export default Amp_MonthlyChart;