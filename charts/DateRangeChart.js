import React, { useState, useEffect } from "react";
import { View, Dimensions, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";

const DateRangeChart = ({ apiUrl, selectedUnit, startDate, endDate }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }),
        });
    
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
    
        const data = await response.json();
        console.log("API Response:", data);
    
        // Validate data structure
        if (!data || !Array.isArray(data.data_points) || !Array.isArray(data.labels)) {
          throw new Error("Invalid data structure: Missing or invalid 'data_points' or 'labels'");
        }
    
        // Normalize data to fill missing dates
        const normalizedData = normalizeData(data.labels, data.data_points, startDate, endDate);
    
        setChartData({
          labels: normalizedData.labels,
          datasets: [{ data: normalizedData.dataPoints }],
        });
    
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chart data:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };
    

    fetchData();
  }, [apiUrl, startDate, endDate, selectedUnit]);

  const normalizeData = (labels, dataPoints, startDate, endDate) => {
    const normalizedLabels = [];
    const normalizedDataPoints = [];
  
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      normalizedLabels.push(formattedDate);
  
      const index = labels.findIndex((label) => label === formattedDate);
      if (index !== -1) {
        normalizedDataPoints.push(dataPoints[index]);
      } else {
        normalizedDataPoints.push(0); // Fill missing dates with 0
      }
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return { labels: normalizedLabels, dataPoints: normalizedDataPoints };
  };
  
  const convertUnits = (value) => {
    switch (selectedUnit) {
      case "واط":
        return value * 1000; // Convert kWh to Watts
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
    return <Text>Error: {error}</Text>;
  }
  
  // Check for empty or all-zero data points
  if (!chartData || chartData.datasets[0].data.every((val) => val === 0)) {
    return <Text>No data available for the selected date range</Text>;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>استهلاك الكهرباء ({selectedUnit})</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width}
        height={280}
        yAxisSuffix={` ${
          selectedUnit === "كيلو واط/ساعة" ? "ك.و.س" : selectedUnit === "واط" ? "واط" : "أمبير"
        }`}
        chartConfig={styles.chartConfig}
        bezier
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 16, textAlign: "center", marginBottom: 5 },
  chartConfig: {
    backgroundColor: "#f2f2f2",
    backgroundGradientFrom: "#f2f2f2",
    backgroundGradientTo: "#f2f2f2",
    color: (opacity = 1) => 'rgba(0, 163, 255, ${opacity})',
    labelColor: (opacity = 1) => 'rgba(0, 0, 0, ${opacity})',
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#00A3FF" },
    style: { borderRadius: 16 },
  },
});

export default DateRangeChart;