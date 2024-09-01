import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { themeColors } from '../theme';

const DateRangePicker = ({ onDatesSelected }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeField, setActiveField] = useState(null);

  const handleStartDateChange = (selectedDate) => {
    if (selectedDate > endDate) {
      // If the selected start date is after the current end date, reset the end date
      setEndDate(selectedDate);
    }
    setStartDate(selectedDate);
  };

  const handleEndDateChange = (selectedDate) => {
    if (selectedDate >= startDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.dateView}>
        <Text style={styles.label}>إختر تاريخ البداية:</Text>
        <TouchableOpacity 
          style={styles.dateTouchable} 
          onPress={() => setActiveField('start')}
        >
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode={'date'}
            is24Hour={true}
            display="default"
            maximumDate={endDate} // Set the maximum date for start date picker as the current end date
            onChange={(event, date) => {
              setActiveField(null);
              handleStartDateChange(date);
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dateView}>
        <Text style={styles.label}>إختر تاريخ النهاية:</Text>
        <TouchableOpacity 
          style={styles.dateTouchable} 
          onPress={() => setActiveField('end')}
        >
          <DateTimePicker
            testID="dateTimePicker"
            value={endDate}
            mode={'date'}
            is24Hour={true}
            display="default"
            minimumDate={startDate} // Ensure end date is not before start date
            maximumDate={new Date()} // Disallow future dates
            onChange={(event, date) => {
              setActiveField(null);
              handleEndDateChange(date);
            }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={() => onDatesSelected(startDate, endDate)}>
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
    backgroundColor: themeColors.lightb,
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