import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalProgressBar = ({ current, target, style }) => {
  const progress = (current / target) * 100;
  const progressPercentage = Math.min(progress, 100); // Ensures it does not exceed 100%

  // Determine the color based on the progress percentage
  let progressColor = '#69BCFA'; // Default color
  if (progress < 50) {
    progressColor = '#4CAF50'; // Under 50%
  } else if (progress >= 50 && progress <= 90) {
    progressColor = '#FFEB3B'; // Between 50%–75%
  } else if (progress > 90) {
    progressColor = '#F44336'; // Exceeding 100%
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { width: `${progressPercentage}%`, backgroundColor: progressColor }]} />
      <Text style={styles.text}>{`${progressPercentage.toFixed(2)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 21,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1, // Add border width
    borderColor: '#CCC', // Add border color
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  text: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 20,
    color: "#143638",
    fontWeight: 'bold',
  },
});

export default GoalProgressBar;