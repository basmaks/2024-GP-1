import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep3() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.navButton}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <Text style={styles.title}>قبل البدء</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
          <Icons.ArrowRightIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.description}>
          قم بتثبيت الجهاز في لوحة الكهرباء الخاصة بمنزلك. ستقوم بإيقاف تشغيل القاطع الرئيسي، مما سيؤدي إلى قطع الطاقة في منزلك. ومع ذلك، ستظل الأسلاك الرئيسية للخدمة مشحونة بشكل خطير.
        </Text>
        
        <Text style={styles.description}>
          من المفيد أيضًا الاستعانة بصديق أثناء التركيب.
        </Text>
        
        <Text style={styles.description}>
          قد تساعدك العناصر التالية في التثبيت بشكل آمن:
        </Text>

        {/* Insert Image Here */}
        <Image 
           source={require('../../assets/images/connectionImages/equipment.png')} 
           style={styles.image}
        />
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step4')}
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
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  navButton: {
  padding: 10,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: themeColors.lightb,
  textAlign: 'center',
  flex: 1, 
},
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
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
