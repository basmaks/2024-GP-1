import React from 'react';
import { ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const Amp_YearlyChart = () => {
  const voltage = 230; // Assumed voltage in volts
  const hoursInMonth = 730; // Average hours in a month

  // Convert kWh to Amps
  const convertedData = [500, 743, 1500, 1286, 876, 940, 867, 790, 877, 1023, 1100, 980].map(kWh => (kWh * 1000) / (voltage * hoursInMonth));

  const chartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    datasets: [{
      data: convertedData
    }]
  };

  const chartWidth = 12 * 60; // Adjust if needed, ensuring all labels are visible

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={280}
          yAxisLabel=""
          yAxisSuffix=" A" // Displaying in Amperes
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

export default Amp_YearlyChart;