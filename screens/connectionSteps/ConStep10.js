import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep10() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.navcontainer}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
          <Text style={styles.stepTitle}>عزل منافذ الصوت 3.5مم</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size="30" color="white" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.description}>
          حدد المنافذ الفارغة لمحول التيار 200A بقياس 3.5 مم أعلى الجهاز الخاص بك. 
          ستكون هذه المنافذ مدرجة بـ A و B و C. بناءً على عملية التثبيت الخاصة بك، قد يكون لديك من 3 منافذ صوتية فارغة إلى عدم وجود أي منها على الإطلاق.
        </Text>
        <Text style={styles.description}>
          إذا لم يكن لديك أي منافذ فارغة، اضغط على زر "التالي".
        </Text>
        <Text style={styles.description}>
          إذا كانت لديك منافذ فارغة، قم بإدخال سدادات العزل 3.5 مم في جميع منافذ 3.5 مم الفارغة لجهازك بحيث تكون معزولة بالكامل.
        </Text>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/connectionImages/panel4.png')} 
            style={styles.image} 
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step11')}
      >
        <Text style={styles.buttonText}>التالي</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
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

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.lightb,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
