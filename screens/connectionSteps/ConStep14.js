import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep14() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>عزل المنافذ لموصل الصوت 2.5mm</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.descriptionContainer}> 
        <Text style={styles.description}>
          حدد المنافذ الفارغة لموصل الصوت 2.5 مم لمحولات التيار 50A على جوانب الجهاز الخاص بك. ستكون هذه المنافذ موسومة من 1 إلى 16. بناءً على عملية التثبيت الخاصة بك.
        </Text>

        <Text style={styles.description}>
          إذا لم يكن لديك أي منافذ فارغة، اختر الخطوة التالية أدناه. إذا كانت لديك منافذ فارغة، قم بإدخال سدادات العزل 2.5 مم المقدمة في جميع المنافذ الفارغة للجهاز بحيث تكون معزولة بالكامل.
        </Text>
</View>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/connectionImages/panel9.png')} 
            style={styles.image} 
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step15')}
      >
        <Text style={styles.buttonText}>التالي</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    justifyContent: 'space-between',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 120,
    backgroundColor: '#143638',
    paddingHorizontal: 20,
    width: '100%',
  },
  goBackContainer: {
    padding: 10,
  },
  support: {
    padding: 10,
  },
  iconStyle: {},
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.lightb,
    textAlign: 'center',
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
    marginBottom: 10,
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
