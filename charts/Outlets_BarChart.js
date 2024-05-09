import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const OutletsBarChart = () => {
    const chartData = {
        labels: ["مقبس ١", "مقبس ٢", "مقبس ٣", "مقبس ٤", "مقبس ٥", "مقبس ٦", "مقبس ٧", "مقبس ٨", "مقبس ٩", "مقبس ١٠"],
        datasets: [
            {
                data: [3, 1, 0.5, 2.5, 3, 3.75, 2, 1.75, 1, 3.5],
            }
        ]
    };

    const chartWidth = 360; 

    const chartConfig = {
        backgroundColor: '#f2f2f2',
        backgroundGradientFrom: '#f2f2f2',
        backgroundGradientTo: '#f2f2f2',
        fillShadowGradient: '#82c8ff', 
        fillShadowGradientOpacity: 1,
        yAxisSuffix: 'ك.و.س',
        color: (opacity = 1) => `rgba(130, 200, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };

    return (
            <View style={styles.container}>
                <Text style={styles.header}>الاستهلاك حسب المقبس الكهربائي</Text>
                <BarChart
                    data={chartData}
                    width={chartWidth}
                    height={220}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={26}
                    fromZero
                    style={styles.chartStyle}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 30,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chartStyle: {
        borderRadius: 16,
        marginVertical: 8,
    }
});

export default OutletsBarChart;
