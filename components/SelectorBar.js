//---------------SelectorBar.js---------------

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SelectorBar = ({ options, selectedIndex, onSelect }) => {
    return (
      <View style={selectorStyles.container}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option}
            style={[
              selectorStyles.option,
              index === selectedIndex ? selectorStyles.selectedOption : {}
            ]}
            onPress={() => onSelect(index)}
          >
            <Text style={[
              selectorStyles.text,
              index === selectedIndex ? selectorStyles.selectedText : selectorStyles.unselectedText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const selectorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 2,
        paddingHorizontal: 35,
        marginTop: 0,
        marginBottom: 30,
        backgroundColor: 'rgba(192, 192, 192, 0.4)',
        borderRadius: 32,
        maxWidth: 346,
        alignSelf: 'center',
    },
    option: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    selectedOption: {
      backgroundColor: '#143638',
      borderRadius: 32,
    paddingHorizontal: 15,
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
    },
    selectedText: {
      color: 'white',
    },
    unselectedText: {
      color: 'black',
    },
  });
  
  export default SelectorBar;
