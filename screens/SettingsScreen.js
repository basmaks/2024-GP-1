import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView, TouchableRipple } from 'react-native'
import { StyleSheet } from 'react-native';
import React, { useState } from 'react'
import * as Icons from "react-native-heroicons/solid";
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth} from '../config/firebase'
import EditProfileScreen from '../screens/EditProfileScreen';
import { signOut } from 'firebase/auth'
import { db } from '../config/firebase';
import { useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';




import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';




export default function SettingsScreen({route}) {

  const navigation = useNavigation();


  const handlePressEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  /*const handleDeviceConnection = () => {
    navigation.navigate('DeviceConnection');
  };*/

  const handleContactUs = () => {
    navigation.navigate('ContactUs');
  };

  const handleLogout = async ()=>{
    await signOut(auth);
  }

  const [firstName, setFirstName] = useState('');


  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      // Check if the updated first name is passed through navigation params
      if (route.params && route.params.updatedFirstName) {
        setFirstName(route.params.updatedFirstName);
      } else {
        // Fetch user data from Firestore
        try {
          const usersRef = collection(db, 'users');
          const querySnapshot = await getDocs(query(usersRef, where('uid', '==', auth.currentUser.uid)));

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setFirstName(userData.firstName);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [route.params]); // Listen for changes in route params


  return (
    <View style={{ flex: 1 }}>
    {/* top nav bar */}
    
    <TopNavBar />
    
    <View style={{ flex: 1 }}>
          {/* Hello, [name] text */}
          <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>مرحبا, {firstName}</Text>
        <Text style={styles.descriptionText}>إعدادات الحساب</Text>

      </View>
      
  {/* Your settings screen content */}
  <View style={styles.contentContainer}>

        <TouchableOpacity
          onPress={handlePressEditProfile} style={[styles.button, { marginTop: 20}]}>
          <Text style={styles.buttonText}>الملف الشخصي</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleChangePassword} style={[styles.button, { marginTop: 20}]}>
          <Text style={styles.buttonText}>تغيير كلمة المرور </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContactUs} style={[styles.button, { marginTop: 20}]}>
          <Text style={styles.buttonText}>تواصل معنا  </Text>
        </TouchableOpacity>


  </View>
  
<View style={styles.logoutButtonPosition}>
  <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
    <Text style={styles.logoutText}>تسجيل خروج</Text>
    <Image source={require('../assets/icons/signoutbutton.png')} style={styles.signoutbutton} />
  </TouchableOpacity>
</View>

</View>

  <BottomNavBar/>

  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  contentContainer: {
    //flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    paddingHorizontal: 20, // Add horizontal padding
    marginBottom: 50,

  },

  greetingContainer: {
    alignItems: 'flex-end', // Align to the right
    paddingTop: 20,
    paddingHorizontal: 20, // Add horizontal padding

  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#143638',
  },

  descriptionText: {
    fontSize: 16,
    color: '#143638', // Adjust color as needed
    marginTop: 15,

  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#143638',

  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right', // Align text to start from the right
  },

  logoutButton: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjusted justifyContent
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoutText: {
    color: '#BC2828',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline', // Underline the text

  },

  logoutButtonPosition: {
    justifyContent: 'flex-end', // Align content to the end (right)
    alignItems: 'flex-end', // Align content to the end (right)
    paddingHorizontal: 20, // Add horizontal padding

  },

  signoutbutton:{
    width: 30,
    height: 30,
    marginLeft: 5,
  }
 
});