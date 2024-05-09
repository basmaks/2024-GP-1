import React from 'react';
  import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import * as Icons from 'react-native-heroicons/solid';
  import { useNavigation } from '@react-navigation/native';
  import TopNavBar2 from '../navigation/TopNavBar2';
  import { themeColors } from '../theme';
  
  export default function ConnectSteps() {
    const navigation = useNavigation();
    
    return (
      <SafeAreaView style={styles.container}>
      <TopNavBar2/>
  
        <View style={styles.container}>
          <View style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة الأولى:</Text>
              <Text style={styles.stepDescription}>قبل البدء، تأكد من وجود اتصال Wi-Fi مستقر وأن هاتفك الذكي متصل بالشبكة.</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة الثانية:</Text>
              <Text style={styles.stepDescription}>قم بإيقاف المفتاح الرئيسي في لوحة التوزيع الكهربائية الخاصة بك لقطع التيار وتجنب أي حوادث كهربائية.</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة الثالثة:</Text>
              <Text style={styles.stepDescription}>قم بإزالة غطاء لوحة التوزيع بحذر للوصول إلى المفاتيح الكهربائية.</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة الرابعة:</Text>
              <Text style={styles.stepDescription}>ثبت أجهزة الاستشعار الخاصة بـ مرشد على خطوط الطاقة الرئيسية الواصلة إلى لوحة التوزيع الخاصة بك.</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة الخامسة:</Text>
              <Text style={styles.stepDescription}>ضع جهاز مراقبة الطاقة داخل لوحة التوزيع الكهربائية الخاصة بك وقم بتوصيل الأجهزة الاستشعارية به.</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة السادسة:</Text>
              <Text style={styles.stepDescription}>أعد تشغيل التيار الكهربائي للوحة التوزيع الخاصة بك بتشغيل المفتاح الرئيسي مرة أخرى.</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.stepText}>الخطوة السابعة:</Text>
              <Text style={styles.stepDescription}>بمجرد توصيل جهاز مراقبة الطاقة بنجاح وتكوينه، قم بإعادة وضع غطاء لوحة التوزيع الكهربائية.</Text>
            </View>
            </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Home')}>
              {/*<Icons.PlusCircleIcon size={30} color="black" style={{ marginRight:15 }} />*/}
              <Text style={styles.buttonText}>ربط الجهاز</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.bg,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    textContainer: {
      
      marginBottom: 25,
      
    },
    stepText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 6,
      textAlign: 'right',
      color: themeColors.lightb,
    },
    stepDescription: {
      fontSize: 16,
      textAlign: 'right',
      color: 'white',
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: themeColors.lightb,
      marginTop:20,
    },
    buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
    },
    containerHeader: {
      width: '100%',
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'flex-end', // Align items to the bottom vertically
      justifyContent: 'center', // Center items horizontally
      paddingHorizontal: 20,
      position: 'absolute',
      width: '100%',
    },
    logoContainer: {
      alignSelf: 'flex-end', 
      marginBottom: 6, 
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
  marginRight:20,
    }
  });
