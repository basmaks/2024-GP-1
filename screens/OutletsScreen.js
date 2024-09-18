import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Dimensions } from "react-native";
import { themeColors } from '../theme';
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';
import Outlets_GraphChart from '../charts/Outlets_GraphChart'; 
import Outlets_BarChart from '../charts/Outlets_BarChart'; 
import { Image } from 'react-native';

export default function OutletsScreen() {
  const [activeTab, setActiveTab] = useState('الاستهلاك');

  const renderContent = () => {
    switch (activeTab) {
      case 'الاستهلاك':
        return <Outlets_BarChart />;
      case 'رسم بياني':
        return <Outlets_GraphChart />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabContainer}>
          {['رسم بياني', 'الاستهلاك'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderContent()}
      
        <View style={styles.lowerContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.largeText}>
              <Image source={require('../assets/icons/bolt2.png')} style={styles.boltIcon} />
              اليوم <Text style={styles.largeUsage}>                             22 <Text style={styles.smallUsage}>ك.و.س</Text></Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} /> 
              مقبس ١:   غرفة الطعام<Text style={styles.infoText}>                             3 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٢:   المطبخ<Text style={styles.infoText}>                                   1 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٣:   الغرفة الرئيسية<Text style={styles.infoText}>                     0.5 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٤:   غرفة المعيشة<Text style={styles.infoText}>                        2.5 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٥:   دورة المياه<Text style={styles.infoText}>                               3 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٦:   غرفة الضيوف<Text style={styles.infoText}>                      3.75 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٧:   غرفة ٣ <Text style={styles.infoText}>                                   2 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٨:   الحديقة<Text style={styles.infoText}>                               1.75 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ٩:   غرفة ٤<Text style={styles.infoText}>                                     1 ك.و.س</Text>
            </Text>
            <Text style={styles.infoText}>
              <Image source={require('../assets/icons/circuit.png')} style={styles.icon} />
              مقبس ١٠:   ممر الدور الأول<Text style={styles.infoText}>                      3.5 ك.و.س</Text>
            </Text>
          </View>            
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
    scrollContent: {
        textAlign: 'left',
    },
    lowerContainer: {
      flex: 1,
      backgroundColor: '#143638',
      paddingHorizontal: 20,
      marginTop: 10,
      textAlign: 'left',
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 10,
      backgroundColor: themeColors.primary,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: themeColors.primary,
    },
    tabText: {
      fontSize: 16,
      color: themeColors.primary,
    },
    textStyle: {
      textAlign: 'left',
      fontSize: 20,
    },
    infoContainer: {
      marginTop: 20,
    },
    largeText: {
        color: themeColors.lightb,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
        paddingBottom: 15,
      },
    infoText: {
      color: 'white',
      fontSize: 16,
      paddingBottom: 10,
      marginBottom: 10,
      textAlign: 'left',
    },
    largeUsage: {
        color: themeColors.lightb,
        fontSize: 26,
        marginBottom: 10,
        textAlign: 'left',
        paddingBottom: 15,
    },
    smallUsage: {
      color: themeColors.lightb,
      fontSize: 17,
      marginBottom: 10,
      textAlign: 'left',
      paddingBottom: 15,
  },
    boltIcon: {
      width:35,
      height:35,
      marginRight: 5,
      alignSelf: 'flex-end',
    },
    icon: {
      width:20,
      height:22,
      marginRight: 5,
      alignSelf: 'flex-end',
    }
  });