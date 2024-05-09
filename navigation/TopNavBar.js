import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as Icons from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native';


export default function TopNavBar() {

  const navigation = useNavigation();

    const handlePressAlerts = () => {
      navigation.navigate('Alerts');
    };
  
    const handleLogout = async ()=>{
      await signOut(auth);
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={handlePressAlerts} style={styles.alertsContainer}>
            <Image source={require('../assets/icons/newalerts.png')} style={styles.alertsIcon} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logobetter.png')} style={styles.logo} />
          </View>

        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
     container: {
      backgroundColor: '#143638', // Set the main background color
      width: '100%',
      height: 120,
      
      
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'flex-end', // Align items to the bottom vertically
      justifyContent: 'center', // Center items horizontally
      height: 120,
      backgroundColor: '#143638',
      paddingHorizontal: 20,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    logoContainer: {
      alignSelf: 'flex-end', // Align to the bottom
      marginBottom: 6, // Add margin from the bottom
    },
    logo: {
      width: 65,
      height: 65,
    },

    flexSpace: {
      flex: 1,
    },

    alertsContainer: {
      position: 'absolute',
      left: 20,
      bottom: 18,
    },

    alertsIcon: {
      width: 30,
      height: 35,
    }

  });