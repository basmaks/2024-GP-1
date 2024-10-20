import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Icons from "react-native-heroicons/outline"; 
import { themeColors } from '../../theme';
import TopNavBarForSteps from '../../navigation/TopNavBarForSteps';


export default function ConStep1() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      <SafeAreaView style={styles.navcontainer}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
          <Text style={styles.stepTitle}>دليل التثبيت</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size="30" color="white" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.contentContainer}>

        <Text style={styles.warning}>تنبيه!</Text>
        <Text style={styles.description}>
          يتطلب تركيب الجهاز توصيله داخل لوحة الكهرباء الخاصة بمنزلك والعمل حول جهد كهربائي عالي. نو ّصي بأن يتم تركيب الجهاز بواسطة شخص مختص مثل الكهربائي.
          {'\n\n'}
          <Text style={{ fontWeight: 'bold' }}>ملاحظة: </Text>
          يجب استخدام منافذ 3.5 مم و2.5 مم فقط لتوصيل مشابك CT المزودة بجهاز مراقبة الطاقة. فهي غير مخصصة لنقل أي إشارة صوتية.
        </Text>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step2')}
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
    paddingBottom: 50,
    marginTop:5,
  },
  warning: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'yellow',
    marginVertical: 20,
    
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
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
