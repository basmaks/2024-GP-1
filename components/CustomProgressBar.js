import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ current, target, style }) => {
  const progress = (current / target) * 100;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { width: `${progress}%` }]} />
      <Text style={styles.text}>{`${progress.toFixed(2)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#69BCFA',
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

export default ProgressBar;
