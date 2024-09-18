import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep5() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.navButton}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <Text style={styles.title}>توصيل جهاز مراقب الطاقة</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
          <Icons.ArrowRightIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.description}>
          يحتوي الجزء العلوي من جهاز مراقب الطاقة على المنافذ الصوتية 3.5 مم A وB وC، وهي المدخلات لمحولات التيار 200 A. قد تتضمن حزمة جهازك اثنين فقط من هذه المحولات.
        </Text>

        <Text style={styles.description}>
          يوجد أيضًا موصل محوري لكابل WiFi على الجزء العلوي من الجهاز.
        </Text>

        <Text style={styles.description}>
          المنافذ 2.5 مم من 1 إلى 16 الموجودة على جوانب الجهاز هي المدخلات لمحولات التيار 50A. حزمة جهازك تحتوي على 16 محولًا.
        </Text>

        <Text style={styles.description}>
          المنفذ الخاص بحزمة الأسلاك يقع في أسفل الجهاز.
        </Text>

        <Text style={styles.description}>
          جميع المنافذ موضحة على الجزء الخلفي لجهاز مراقبة الطاقة.
        </Text>

        <View style={styles.diagramContainer}>
          <Image source={require('../../assets/images/connectionImages/energyDevice.png')} style={styles.image} />
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step6')}
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
  navButton: {
    padding: 10,
  },
  iconStyle: {},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.lightb,
    textAlign: 'center',
    flex: 1, 
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
  image: {
    width: '100%',
    height: 400,  
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
