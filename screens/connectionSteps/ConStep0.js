import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import TopNavBarNoBack from '../../navigation/TopNavBarNoBack';


export default function ConStep0() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TopNavBarNoBack/>

      <View style={styles.contentContainer}>
        <View style={styles.centerContent}>
        <Text style={styles.headerText}>مرحبا بك!</Text>
          <Text style={styles.description}>إذا كانت هذه المرة الأولى التي تقوم فيها بإعداد الجهاز، توصي باتباع دليل الثبيت.</Text>
           <Text style={styles.description}>إذا كنت قد قمت بتثبيت الجهاز من قبل، يمكنك الانتقال مباشرة إلى صفحة ربط الجهاز. </Text>
        </View>

        <View style={styles.bottomSection}>
          {/*<Text style={styles.chooseText}>اختر خطوتك التالية...</Text>*/}

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Step1')}
            >
              <Text style={styles.buttonText}>الانتقال إلى دليل التثبيت</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('ConnectScreen')}
            >
              <Text style={styles.buttonText}>الانتقال مباشرة إلى ربط الجهاز</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    justifyContent: 'space-between',
  },
  navBar: {
    height: 120,
    backgroundColor: '#143638',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    //fontWeight: 'bold',
    color: themeColors.lightb,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20
  },
  bottomSection: {
    marginBottom: 30,
  },
  chooseText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: themeColors.lightb,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
        color: 'white',
        marginBottom: 40,

    },
});
