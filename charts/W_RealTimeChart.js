import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const W_RealTimeChart = ({ apiUrl }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const scrollViewRef = useRef();

  useEffect(() => {
    let isMounted = true;

    const fetchDataAndUpdateChart = async () => {
      if (!isMounted) return;

      try {
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (typeof json !== 'object' || json === null) {
          console.error('Unexpected response structure:', json);
          throw new Error('Data is not an object or is null');
        }

        let totalUsage = 0;
        for (const deviceId in json) {
          const device = json[deviceId];
          if (device && typeof device === 'object' && device.channels) {
            for (const channelId in device.channels) {
              const channel = device.channels[channelId];
              if (channel && typeof channel === 'object' && !isNaN(channel.usage)) {
                // Convert kWh to watts by multiplying by 1,000
                totalUsage += Number(channel.usage) * 1000;
              }
            }
          }
        }

        const now = new Date();
        const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        setChartData(prevChartData => {
          const dataLength = prevChartData.datasets[0].data.length;
          const labels = dataLength >= 120 ? prevChartData.labels.slice(1) : prevChartData.labels;
          const data = dataLength >= 120 ? prevChartData.datasets[0].data.slice(1) : prevChartData.datasets[0].data;

          return {
            labels: [...labels, currentTime],
            datasets: [
              {
                data: [...data, totalUsage],
              }
            ]
          };
        });

        // Scroll to the end of the ScrollView to show the latest data
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(fetchDataAndUpdateChart, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      style={{ marginVertical: 10 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      showsHorizontalScrollIndicator={false}
    >
      <View>
        {chartData.labels.length > 0 ? (
          <LineChart
            data={chartData}
            width={Math.max(400, chartData.labels.length * 70)}
            height={280}
            chartConfig={{
              backgroundColor: '#f2f2f2',
              backgroundGradientFrom: '#f2f2f2',
              backgroundGradientTo: '#f2f2f2',
              fillShadowGradient: '#82c8ff', 
              fillShadowGradientOpacity: 0.8,
              decimalPlaces: 0, 
              color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              yAxisSuffix: 'ك.و.س', 
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 0,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.loadingText}>جاري إحضار البيانات..</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default W_RealTimeChart;