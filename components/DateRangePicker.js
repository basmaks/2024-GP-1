import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { themeColors } from '../theme';

const DateRangePicker = ({ onDatesSelected, setShowDatePicker }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleApply = () => {
    onDatesSelected(startDate, endDate); // Pass the selected dates back to the parent
    setShowDatePicker(false); // Hide the date picker
  };

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.dateView}>
        <Text style={styles.label}>إختر تاريخ البداية:</Text>
        <TouchableOpacity style={styles.dateTouchable}>
          <DateTimePicker
            value={startDate}
            mode="date"
            is24Hour
            display="default"
            maximumDate={endDate}
            onChange={(event, date) => setStartDate(date || startDate)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dateView}>
        <Text style={styles.label}>إختر تاريخ النهاية:</Text>
        <TouchableOpacity style={styles.dateTouchable}>
          <DateTimePicker
            value={endDate}
            mode="date"
            is24Hour
            display="default"
            minimumDate={startDate}
            maximumDate={new Date()}
            onChange={(event, date) => setEndDate(date || endDate)}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.buttonText}>تطبيق التخصيص</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateRangePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    margin: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  dateView: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: themeColors.bg,
  },
  dateTouchable: {
    
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  applyButton: {
    backgroundColor: '#82C7FA',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
  }
});