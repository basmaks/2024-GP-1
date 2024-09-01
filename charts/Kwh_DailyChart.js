import React, { useState } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const Kwh_DailyChart = () => {
  const [tooltip, setTooltip] = useState({ visible: false, xValue: '', yValue: '', x: 0, y: 0 });
  const screenWidth = Dimensions.get('window').width;

  const getTimeForIndex = index => {
    const hour = index % 24;
    const amPm = hour < 12 ? 'ص' : 'م';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${amPm}`;
  };

  const chartData = {
    labels: ['12 AM', "", "", "", '4 AM', "", "", "", '8 AM', "", "", "", '12 PM'],
    datasets: [{
      data: [5, 4.5, 4, 5.5, 5, 3, 2, 1.5, 0.5, 1, 2.5, 1.5, 1.5]
    }]
  };

  const handleDataPointClick = (data, index) => {
    const value = chartData.datasets[0].data[index];
    if (value !== null) {
      let xPos = data.x - 60;
      let yPos = data.y - 70;
      
      if (xPos < 0) {
        xPos = 10;
      } else if (xPos + 120 > screenWidth) {
        xPos = screenWidth - 130;
      }

      setTooltip({
        visible: true,
        xValue: getTimeForIndex(index),
        yValue: value.toFixed(2),
        x: xPos,
        y: yPos
      });
    } else {
      setTooltip({ ...tooltip, visible: false });
    }
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={360}
        height={280}
        yAxisSuffix=" ك.و.س"
        chartConfig={styles.chartConfig}
        bezier
        onDataPointClick={({ index, value, x, y }) => handleDataPointClick({ value, x, y }, index)}
        decorator={() => {
          if (tooltip.visible) {
            return (
              <View style={styles.tooltipStyle(tooltip.x, tooltip.y)}>
                <Text style={styles.tooltipText}>{`الوقت: ${tooltip.xValue}`}</Text>
                <Text style={styles.tooltipText}>{`الاستهلاك: ${tooltip.yValue} ك.و.س`}</Text>
              </View>
            );
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartConfig: {
    backgroundColor: '#f2f2f2',
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    fillShadowGradient: '#82c8ff', 
    fillShadowGradientOpacity: 0.8,
    decimalPlaces: 0,
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
  tooltipStyle: (x, y) => ({
    position: 'absolute',
    left: x,
    top: y,
    backgroundColor: '#143638',
    padding: 5,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'flex-end',
  }),
  tooltipText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'right',
  }
});

export default Kwh_DailyChart;