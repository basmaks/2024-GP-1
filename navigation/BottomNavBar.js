import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as Icons from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useIsFocused } from '@react-navigation/native';

export default function BottomNavBar() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();


  //without checking the screens inside the settings screen
    /*const getCurrentRouteName = () => {
      const currentRoute = navigation?.getState()?.routes[navigation?.getState()?.index]?.name;
      return currentRoute;
  };*/

  //with checking the screens inside the settings screen
  const getCurrentRouteName = () => {
    const routes = navigation?.getState()?.routes;
    const currentIndex = navigation?.getState()?.index;
    if (routes && currentIndex !== undefined && currentIndex < routes.length) {
        // Check if any route in the stack belongs to the "Settings" stack
        for (let i = currentIndex; i >= 0; i--) {
            if (routes[i].name === 'Settings') {
                return 'Settings';
            }
        }
        // If not, return the name of the current route
        return routes[currentIndex].name;
    }
    return null;
};
    
    const handleLogout = async ()=>{
      await signOut(auth);
    }
    
    return (
        <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.container}>
        <View style={styles.navBarBottom}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Image
                            source={(getCurrentRouteName() === 'Settings' && isFocused) ? require('../assets/icons/newsettings_active.png') : require('../assets/icons/newsettings.png')}
                            style={styles.logo}
                        />
                    </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Recommendations')}>
                <Image
                    source={getCurrentRouteName() === 'Recommendations' ? require('../assets/icons/newrecommendations_active.png') : require('../assets/icons/newrecommendations.png')}
                    style={styles.logo}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
                <Image
                    source={getCurrentRouteName() === 'Analytics' ? require('../assets/icons/newanalytics_active.png') : require('../assets/icons/newanalytics.png')}
                    style={styles.logo}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image
                    source={getCurrentRouteName() === 'Home' ? require('../assets/icons/newhome_active.png') : require('../assets/icons/newhome.png')}
                    style={styles.logo}
                />
            </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    );
    }
    
    const styles = StyleSheet.create({
       container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
      },
      navBarBottom: {
        flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 82,
    paddingHorizontal: 20,
    top: 0,
    width: '100%',
    paddingBottom: 13

    
      },
      logo: {
        width: 53,
        height: 50,
      },
      safeArea: {
        flex: 1,
        paddingBottom: 0, // Ensure no padding at the bottom
      }
      
    });