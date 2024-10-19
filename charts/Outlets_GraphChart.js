import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';

const OutletsChart = () => {
    const screenWidth = Dimensions.get("window").width;
    const outlets = ["مقبس ١", "مقبس ٢", "مقبس ٣", "مقبس ٤", "مقبس ٥", "مقبس ٦", "مقبس ٧", "مقبس ٨", "مقبس ٩", "مقبس ١٠", "الكل"];
    const colors = ["#82C8FF", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#D35400", "#2980B9", "#8E44AD", "#2ECC71", "#34495E"];

    // Start with 'الكل' to display all data initially
    const [selectedOutlet, setSelectedOutlet] = useState('الكل');

    // Function to generate data based on the selected outlet
    const getData = () => {
        return {
            labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو"].reverse(),
            datasets: outlets.filter(outlet => selectedOutlet === "الكل" || outlet === selectedOutlet).map((outlet, index) => ({
                data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100].reverse(),
                color: (opacity = 1) => colors[index % colors.length],
                strokeWidth: 2,
                label: outlet
            }))
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
                        marginTop:15//new
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
        //padding: 10,
        paddingHorizontal: 20,
    },
    header: {
        //fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
        color: 'black', // Adjust color as needed
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
        //paddingRight: 30, 
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
    fillShadowGradientOpacity: 0.1, //adjust to increase chart opacity
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
