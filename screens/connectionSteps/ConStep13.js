import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep13() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>توصيل محولات تيار 50A</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.description}>
      افتح المشابك على محولات التيار 50A وضع كل مشبك حول السلك الحار من القاطع الذي ترغب في مراقبته.
ثم، أغلق المشابك لتأمين محولات التيار.        </Text>

        <Text style={styles.importantText}>
          مهم! يجب أن يكون نقش K→L على أسفل المستشعرات موجهًا بعيدًا عن القواطع. بعد ذلك، قم بإدخال مقابس الصوت المتصلة بها في منافذ 2.5 مم على جوانب جهاز مراقبة الطاقة. لاحظ أرقام المنافذ لتتمكن من تسمية الدوائر في التطبيق.
        </Text>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/connectionImages/panel7.png')} 
            style={styles.image2} 
          />
        </View>

        <Text style={styles.description}>
         إذا كنت ترغب في مراقبة القواطع ثنائية القطب أو ثلاثية القطب، يمكنك إما استخدام محول تيار واحد على كل قطب، أو استخدام محول تيار واحد فقط. لاستخدام محول تيار واحد، قم بتثبيت المشبك حول أحد الأسلاك الساخنة القادمة من القاطع (لا يهم أي منها).
        </Text>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/connectionImages/panel8.png')} 
            style={styles.image} 
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step14')}
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
  importantText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'yellow',
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
  image2: {
    width: '100%',
    height: 400, 
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