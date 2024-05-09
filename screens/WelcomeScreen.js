import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';




export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }} 
    >
      <View className="flex-1 flex justify-around my-4">
        <View className="flex-row justify-center" style={styles.logoContainer}>
          <Image source={require("../assets/images/logoWelcome.png")} style={styles.logo} />
        </View>
        <Text className="text-white text-s text-center" style={styles.title}>
          تتبع استهلاكك في بيتك
        </Text>
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="py-3 mx-7 rounded-xl"
            style={{ backgroundColor: themeColors.lightb }}
          >
            <Text className="text-xl font-bold text-center text-black-700" style={styles.buttonText}>
              ابدأ الان
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-semibold text-[#82C8FF] underline">
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold">لديك حساب؟</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 100,
    alignSelf: 'center', // Center the image horizontally
  },
  logoContainer: {
    alignItems: 'center', // Center the content vertically
    marginTop: 210,
  },

  title: {
    fontSize: 16,
    marginTop: 250,
  },

  buttonText: { fontSize: 18}
});

//modified code putting white border down but there is an error
/*
export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: themeColors.bg }} 
    >
      <View className="flex-1 flex justify-around my-4">
        <View className="flex-row justify-center">
          <Image source={require("../assets/images/logo.png")} style={{ width: 300, height: 100 }} />
        </View>
        <Text className="text-white text-s text-center">
          تتبع استهلاكك في بيتك
        </Text>
   </View>
        <View className="  flex-1 bg-white justify-around my-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="py-3 mx-7 rounded-xl"
            style={{ backgroundColor: themeColors.lightb }}
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              ابدأ الان
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-semibold text-[#82C8FF] underline">
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
            <Text className="text-black font-semibold">لديك حساب؟</Text>
          </View>
        </View>
      
    </SafeAreaView>
  );
  }
  */
