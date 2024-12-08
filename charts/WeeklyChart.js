import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';

const WeeklyChart = ({ selectedUnit }) => {
  const [tooltip, setTooltip] = useState({ visible: false, xValue: '', yValue: '', x: 0, y: 0 });
  const [chartData, setChartData] = useState(null); // Dynamic data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  const getDayForIndex = index => {
    const daysInArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return daysInArabic[index];
  };

  const getCurrentWeekRangeInArabic = () => {
    const startOfWeek = moment().startOf('week').format('DD/MM/YYYY');
    const endOfWeek = moment().endOf('week').format('DD/MM/YYYY');
    return `من ${startOfWeek} إلى ${endOfWeek}`;
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/v1/data/byWeek'); // Use your endpoint for weekly data
        const data = await response.json();
  
        if (!response.ok || !data.daily_consumption_kWh) {
          throw new Error('Error fetching data');
        }
  
        const labels = Object.keys(data.daily_consumption_kWh).map((_, index) => getDayForIndex(index));
        const datasets = [{
          data: Object.values(data.daily_consumption_kWh).map(val => convertUnits(val)), // Apply unit conversion
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
  
    fetchData(); // Fetch data when component mounts
  }, [selectedUnit]); // Re-fetch data when `selectedUnit` changes  

  // Convert based on the selected unit
  const convertUnits = (value) => {
    switch (selectedUnit) {
      case "واط":
        return value * 1000; // kWh to Watt
      case "أمبير":
        return value * 4.54; // Example conversion from kWh to Amp (you should replace this with the actual conversion logic)
      default:
        return value; // Default is kWh
    }
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

      const day = getDayForIndex(index);

      setTooltip({
        visible: true,
        xValue: day,
        yValue: value.toFixed(2),
        x: xPos,
        y: yPos
      });
    } else {
      setTooltip({ ...tooltip, visible: false });
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
      <Text style={styles.title}>معدل إستهلاك الكهرباء الأسبوعي ({selectedUnit})</Text>
      <Text style={styles.subTitle}>{getCurrentWeekRangeInArabic()}</Text>
      {chartData && (
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={280}
          yAxisSuffix={` ${selectedUnit === 'كيلو واط/ساعة' ? 'ك.و.س' : selectedUnit === 'واط' ? 'واط' : 'أمبير'}`}
          chartConfig={styles.chartConfig}
          bezier
          onDataPointClick={({ index, value, x, y }) => handleDataPointClick({ value, x, y }, index)}
          decorator={() => {
            if (tooltip.visible) {
              return (
                <View style={styles.tooltipStyle(tooltip.x, tooltip.y)}>
                  <Text style={styles.tooltipText}>{`اليوم: ${tooltip.xValue}`}</Text>
                  <Text style={styles.tooltipText}>{`الاستهلاك: ${tooltip.yValue} ${selectedUnit}`}</Text>
                </View>
              );
            }
          }}
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
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
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

export default WeeklyChart;