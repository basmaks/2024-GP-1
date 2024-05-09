import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const FilterChart = ({ data }) => {
    const screenWidth = Dimensions.get("window").width;

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    };

    // Assuming data is an array of numbers; check for validity
    const validData = data.map(item => {
        return isFinite(item) ? item : 0; // Replace non-finite values with 0
    });

    const lineChartData = {
        labels: validData.map((_, index) => `Label ${index}`),
        datasets: [{
            data: validData
        }]
    };

    return (
        <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={256}
            chartConfig={chartConfig}
            bezier
        />
    );
}

export default FilterChart;

/*import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const FilterChart = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#00A3FF"
    }
  };

  return (
    <LineChart
      data={{
        labels: data.map((item, index) => `Label ${index}`), // customize labels based on your data
        datasets: [
          {
            data: data.map(item => item)
          }
        ]
      }}
      width={screenWidth - 40} // from react-native
      height={256}
      chartConfig={chartConfig}
      bezier
    />
  );
}

export default FilterChart;*/