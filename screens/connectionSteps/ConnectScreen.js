import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icons from 'react-native-heroicons/outline';
import { themeColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function ConnectScreen() {
  const navigation = useNavigation();
  const [serialNumber, setSerialNumber] = useState('');

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.navcontainer}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
          <Text style={styles.stepTitle}>ربط الجهاز</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size="30" color="white" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Form Content */}
      <View style={styles.formContainer}>
        <View style={styles.texts}>
          <Text style={styles.subHeaderText}>
           ادخل الرقم التسلسلي لربط الجهاز والوصول إلى جميع خدمات مرشد, والبدء بإدارة منزلك
          </Text>

          {/* Add the image here */}
          <Image 
            source={require('../../assets/images/connectionImages/panel11.png')} 
            style={styles.image} 
          />
        </View>

        <TextInput
          style={styles.input}
          value={serialNumber}
          onChangeText={setSerialNumber}
          placeholder="أدخل الرقم التسلسلي الموجود أسفل الجهاز"
          placeholderTextColor="black"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Icons.PlusCircleIcon size={23} color="black" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>ربط الجهاز</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg, // Apply the background color of steps
    justifyContent: 'space-between',
  },
 
  navcontainer: {
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
  titleContainer: {
     justifyContent: 'center', // Vertically center the content inside the container
     marginBottom: 15,
  },

  stepTitle:{
     fontSize: 18,
  fontWeight: 'bold',
  color: themeColors.lightb,
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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.lightb, // Match title style with steps pages
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  texts: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    justifyContent: 'center',
    paddingBottom: 64,
    marginTop: 250,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white', // Match text color with steps
    marginBottom: 6,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'white', // Match text color with steps
    //marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%', // Adjust this based on how large you want the image
    height: 300, // Set an appropriate height for your image
    resizeMode: 'contain', // To maintain the aspect ratio of the image
    marginBottom: 20, // Optional, for some space below the image
  },
  input: {
    padding: 15,
    backgroundColor: 'white', // Same input style as steps
    borderRadius: 15,
    marginBottom: 20,
    textAlign: 'right',
    paddingHorizontal: 30,
    color: 'white', // Ensure input text is visible on dark background
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: themeColors.lightb, // Button style matching steps
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
});
