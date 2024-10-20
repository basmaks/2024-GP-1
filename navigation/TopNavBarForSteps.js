//navbar for دليل التثبيت

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as Icons from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native';


export default function TopNavBarForSteps() {

  const navigation = useNavigation();

  
    const handleLogout = async ()=>{
      await signOut(auth);
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logobetter.png')} style={styles.logo} />
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size="30" color="white" style={styles.iconStyle} />
          </TouchableOpacity>

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

    support: {
      position: 'absolute',
      left: 20,
      bottom: 18,
    },
 goBackContainer: {
      position: 'absolute',
      right: 20,
      bottom: 18,
    },

    iconStyle: {

    }

  });