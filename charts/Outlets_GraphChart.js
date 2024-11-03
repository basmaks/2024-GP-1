import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';

const OutletsChart = () => {
    const screenWidth = Dimensions.get("window").width;
    const outlets = ["مقبس ١", "مقبس ٢", "مقبس ٣", "مقبس ٤", "مقبس ٥", "مقبس ٦", "مقبس ٧", "مقبس ٨", "مقبس ٩", "مقبس ١٠"];
    const colors = ["#82C8FF", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#D35400", "#2980B9", "#8E44AD", "#2ECC71"];

    // Start with the first outlet displayed initially
    const [selectedOutlet, setSelectedOutlet] = useState('مقبس ١');

    // Realistic monthly consumption data (in kWh) for May to November for each outlet
    const realisticData = {
        "مقبس ١": [1.2, 1.3, 1.1, 1.4, 1.35, 1.25, 0.3],
        "مقبس ٢": [0.6, 0.7, 0.65, 0.75, 0.8, 0.78, 0.72],
        "مقبس ٣": [0.4, 0.5, 0.45, 0.52, 0.51, 0.49, 0.5],
        "مقبس ٤": [0.3, 0.35, 0.32, 0.38, 0.36, 0.34, 0.3],
        "مقبس ٥": [1.8, 1.9, 1.7, 1.85, 1.9, 1.88, 1.82],
        "مقبس ٦": [0.9, 1.0, 0.95, 1.1, 1.05, 1.02, 1.0],
        "مقبس ٧": [0.2, 0.25, 0.22, 0.28, 0.26, 0.24, 0.23],
        "مقبس ٨": [1.1, 1.2, 1.15, 1.3, 1.18, 1.16, 1.12],
        "مقبس ٩": [0.5, 0.55, 0.53, 0.57, 0.56, 0.54, 0.5],
        "مقبس ١٠": [0.4, 0.45, 0.43, 0.48, 0.46, 0.44, 0.42],
    };

    // Function to generate data based on the selected outlet
    const getData = () => {
        return {
            labels: ["مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر"],
            datasets: [{
                data: realisticData[selectedOutlet],
                color: (opacity = 1) => colors[outlets.indexOf(selectedOutlet) % colors.length],
                strokeWidth: 2,
                label: selectedOutlet
            }]
        };
    };

    // Use useEffect to handle changes in selectedOutlet
    useEffect(() => {
        setData(getData());
    }, [selectedOutlet]);

    // State to hold chart data
    const [data, setData] = useState(getData());

    return (
        <ScrollView style={styles.scrollContent}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>اختر مقبس الكهرباء:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedOutlet(value)}
                    items={outlets.map(outlet => ({ label: outlet, value: outlet }))}
                    style={pickerSelectStyles}
                    value={selectedOutlet}
                    placeholder={{ label: "اختر مقبس", value: null }}
                />
            </View>
            {data && data.datasets.length > 0 ? (
                <LineChart
                    data={data}
                    width={screenWidth}
                    height={256}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 10,
                        borderRadius: 16,
                        marginTop: 15
                    }}
                />
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>اختر مقبس الكهرباء..</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        textAlign: 'right',
    },
    headerContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 16,
        marginLeft: 10,
        color: 'black',
        marginTop: 15,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginTop: 15,
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        textAlign: 'center',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, 
        textAlign: 'center',
    },
});

const chartConfig = {
    backgroundColor: '#f2f2f2',
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    fillShadowGradient: '#82c8ff', 
    fillShadowGradientOpacity: 0.1,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(130, 200, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#82C8FF"
    }
};

export default OutletsChart;
