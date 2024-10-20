import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Icons from "react-native-heroicons/solid"; 

    
const TopNavBarNoBack = () => {
    const navigation = useNavigation();
  
    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.navBar}>
            
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
  
      goBackContainer: {
        position: 'absolute',
        right: 20,
        bottom: 18,
      },
  
      iconStyle: {
  
      }
  
    });
     
  export default TopNavBarNoBack;
  