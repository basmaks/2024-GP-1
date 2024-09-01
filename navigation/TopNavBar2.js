import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Icons from "react-native-heroicons/solid"; 

const TopNavBar2 = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size="30" color="white" style={styles.iconStyle} />
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

    goBackContainer: {
      position: 'absolute',
      right: 20,
      bottom: 18,
    },

    iconStyle: {

    }

  });
    /*<View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icons.ArrowRightIcon size="20" color="white" style={styles.iconContainer} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logobetter.png')} style={styles.logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#143638', 
    width: '100%',
    height: 120,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    justifyContent: 'center', 
    height: 120,
    backgroundColor: '#143638',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  backButton: {
    backgroundColor: '#143638', 
  },
  logoContainer: {
    alignSelf: 'flex-end', 
    marginBottom: 6, 
  },
  iconContainer: {
    position: 'absolute',
    left: 20,
    bottom: 18,
  },
  logo: {
    width: 65,
    height: 65,
  },
});
*/
export default TopNavBar2;
