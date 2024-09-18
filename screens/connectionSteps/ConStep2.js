import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from "react-native-heroicons/outline";

export default function ConStep2() {
  const navigation = useNavigation();

  const instructions = [
    "يجب ارتداء معدات الحماية الشخصية عند تثبيت الجهاز",
    "لا تستخدم الجهاز بأي طريقة لم تذكر في دليل التركيب",
    "لا تحاول فتح أو تفكيك أو إصلاح أي جزء من الجهاز",
    "لا تستخدم الجهاز إذا لاحظت أي جزء متضرر",
    "لا تقم بتركيب الجهاز في بيئة تحتوي على غازات أو أبخرة متفجرة، أو في بيئة رطبة أو مبللة، أو في ضوء الشمس المباشر، أو في مكان بدرجة حرارة أقل من -٤٠ درجة مئوية أو أعلى من ٥٠ درجة مئوية",
    "تأكد من فصل الجهاز عن مصدر الطاقة أثناء التعامل معه، بما في ذلك التثبيت والتركيب",
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>إرشادات السلامة</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.bulletPointContainer}>
            
            <Text style={styles.description}>{instruction}</Text>
            <Text style={styles.bulletPoint}>•</Text>
          </View>
        ))}
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step3')}
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
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  bulletPoint: {
    fontSize: 24,
    color: themeColors.lightb,
    marginLeft: 10,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    flex: 1,
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
