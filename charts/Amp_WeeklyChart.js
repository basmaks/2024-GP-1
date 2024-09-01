import React from 'react';
import { ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const Amp_WeeklyChart = () => {
  const voltage = 230; // Voltage in volts
  const hoursInDay = 24; // Hours in a day

  // Converting kWh to Amps assuming each kWh value is the total energy consumed in a day
  const chartData = {
    labels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    datasets: [{
      data: [10, 20, 30, 40, 50, 30, 45].map(kWh => (kWh * 1000) / (voltage * hoursInDay)) // Convert kWh to Amps
    }]
  };

  const chartWidth = 350; // Chart width

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={280}
          yAxisLabel=""
          yAxisSuffix=" A" // Amps
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

export default Amp_WeeklyChart;