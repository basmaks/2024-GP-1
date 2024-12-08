// ExportData.js

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import TopNavBar2 from '../navigation/TopNavBar2';
import BottomNavBar from '../navigation/BottomNavBar';

export default function ExportDataScreen() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    const [isEndPickerVisible, setEndPickerVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleExportData = async () => {
        setIsLoading(true); // Show loading indicator
        try {
            const startDateFormatted = startDate.toISOString().split("T")[0];
            const endDateFormatted = endDate.toISOString().split("T")[0];
    
            const response = await fetch(
                `http://127.0.0.1:8000/api/v1/export?start_date=${startDateFormatted}&end_date=${endDateFormatted}`
            );
    
            if (!response.ok) {
                throw new Error("Failed to fetch file");
            }
    
            const contentDisposition = response.headers.get("Content-Disposition");
            const match = contentDisposition?.match(/filename="(.+)"/);
            const fileName = match ? match[1] : `data_${startDateFormatted}_to_${endDateFormatted}.csv`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Data = reader.result.split(",")[1];
                await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });
    
                Alert.alert("Download Complete", `File saved to: ${fileUri}`);
    
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                } else {
                    Alert.alert("Sharing is not available on this device.");
                }
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error("Error exporting data:", error);
            Alert.alert("حدث خطأ أثناء تحميل البيانات.");
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    return (
        <View style={{ flex: 1 }}>
        <TopNavBar2 />
    
        {/* Title Section */}
        <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>تحميل بيانات الاستهلاك</Text>
            <Text style={styles.descriptionText}>
                تحديد الفترة الزمنية لتحميل بيانات الاستهلاك الخاصة بك
            </Text>
        </View>
    
        {/* Content Section */}
        <View style={styles.contentContainer}>
            <TouchableOpacity
                onPress={() => setStartPickerVisible(true)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>اختر تاريخ البدء</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="date"
                onConfirm={(date) => {
                    setStartDate(date);
                    setStartPickerVisible(false);
                }}
                onCancel={() => setStartPickerVisible(false)}
            />
    
            <TouchableOpacity
                onPress={() => setEndPickerVisible(true)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>اختر تاريخ الانتهاء</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isEndPickerVisible}
                mode="date"
                onConfirm={(date) => {
                    setEndDate(date);
                    setEndPickerVisible(false);
                }}
                onCancel={() => setEndPickerVisible(false)}
            />
    
            <TouchableOpacity
                onPress={handleExportData}
                style={[styles.buttonBlue, { marginTop: 20 }]}
            >
                <Text style={styles.buttonTextBlue}>تحميل البيانات</Text>
            </TouchableOpacity>
    
            {isLoading && <ActivityIndicator size="large" color="#82C7FA" />}
        </View>
    
        <BottomNavBar />
    </View>
    
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greetingContainer: {
        alignItems: 'flex-end', // Align title to the right
        justifyContent: 'flex-start', // Place at the top
        paddingTop: 20, // Adjust spacing from the top
        paddingHorizontal: 20, // Add horizontal padding
        marginBottom: 10, // Add space below the title
    },
    greetingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#143638',
    },
    descriptionText: {
        fontSize: 16,
        color: '#143638',
        marginTop: 10, // Space between title and description
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start', // Align content towards the top
        paddingHorizontal: 20,
        marginTop: 20, // Move buttons closer to the title
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#143638',
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    buttonBlue: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#82C7FA',
        marginVertical: 5,
    },
    buttonTextBlue: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
});
