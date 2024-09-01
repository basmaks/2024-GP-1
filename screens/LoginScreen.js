/*import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icons from "react-native-heroicons/solid";
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import TopNavBar from '../navigation/TopNavBar';
export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async ()=>{
      if(email && password){
          try{
              await signInWithEmailAndPassword(auth, email, password);
          }catch(err){
              console.log('got error: ',err.message);
              let msg = err.message;
              if(msg.includes('invalid-login-credentials')) msg = "Invalid credentials";
              if(msg.includes('auth/invalid-email')) msg = "Invalid email";
              Alert.alert('Sign In', msg);
          }
      }
  }
  return (
    <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
      <SafeAreaView  className="flex ">
        <View className="flex-row justify-end">
        <TouchableOpacity 
                onPress={()=> navigation.goBack()}
                className="bg-[#82C8FF] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
                <Icons.ArrowRightIcon size="20" color="white" />
            </TouchableOpacity>
        </View>
        <View  className="flex-row justify-center">
          <Image source={require('../assets/images/logo.png')} 
          style={{width: 100, height: 50}} />
        </View>
        
        
      </SafeAreaView>
      <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">البريد الالكتروني</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              placeholder="البريد الالكتروني"
              value={email}
              onChangeText={value=> setEmail(value)}
            />
            <Text className="text-gray-700 ml-4">كلمة المرور</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
              secureTextEntry
              placeholder="ادخل كلمة المرور"
              value={password}
              onChangeText={value=> setPassword(value)}
            />
            <TouchableOpacity className="flex items-end">
              <Text className="text-gray-700 mb-5">نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSubmit}
              className="py-3 rounded-xl"style={{ backgroundColor: themeColors.lightb }}>
              
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        تسجيل الدخول
                </Text>
             </TouchableOpacity>
            
          </View>
          
        
          <View className="flex-row justify-center mt-7">
          <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                  <Text className="font-semibold text-[#82C8FF] underline">انشئ حساب</Text>
              </TouchableOpacity>
              <Text className="text-gray-500 font-semibold">
                  مستخدم جديد؟
              </Text>
              
          </View>
          
      </View>
    </View>
  )
}*/
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icons from "react-native-heroicons/solid";
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import TopNavBar2 from '../navigation/TopNavBar2';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me toggle

 

  const handleSubmit = async () => {
    if (email && password) {
      try {
        let user = await signInWithEmailAndPassword(auth, email, password)
        let token = await AsyncStorage.getItem('token');
        // saveToken(user.user.uid, token)
        await AsyncStorage.setItem('currentUser', JSON.stringify({ uid: user.user.uid, token: token }));
        if (rememberMe) {
          // Save user session to local storage
          await AsyncStorage.setItem('rememberedUser', JSON.stringify({ email }));
        }
      } catch (err) {
        console.log('got error: ', err.message);
        let msg = err.message;
        if (msg.includes('invalid-login-credentials')) msg = "البريد الاكتروني أو كلمة المرور غير صحيحة";
        if (msg.includes('auth/invalid-email')) msg = "البريد الاكتروني أو كلمة المرور غير صحيحة";
        Alert.alert('خطأ', msg);
      }
    }
  }

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  }

  const RememberMeButton = ({ rememberMe, toggleRememberMe }) => (
    <TouchableOpacity style={styles.rememberMeButton} onPress={toggleRememberMe}>
      <Text style={styles.rememberMeButtonText}>{rememberMe ? 'تذكرني' : 'تذكرني'}</Text>
      <View style={[styles.rememberMeIndicator, rememberMe ? styles.rememberMeIndicatorActive : null]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopNavBar2 />
      <SafeAreaView style={styles.safeAreaView}>

        <View style={styles.content}>
          <Text style={styles.emailLabel}>البريد الالكتروني<Text style={styles.required}> *</Text></Text>
          <TextInput
            style={styles.emailInput}
            placeholder="البريد الالكتروني"
            value={email}
            onChangeText={value => setEmail(value)}
          />
          <Text style={styles.passwordLabel}>كلمة المرور<Text style={styles.required}> *</Text></Text>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry
            placeholder="ادخل كلمة المرور"
            value={password}
            onChangeText={value => setPassword(value)}
          />

          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
            <RememberMeButton rememberMe={rememberMe} toggleRememberMe={toggleRememberMe} />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
          </TouchableOpacity>


          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>انشئ حساب</Text>
            </TouchableOpacity>
            <Text style={styles.signUpText}>مستخدم جديد؟</Text>
          </View>

        </View>
      </SafeAreaView>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,

  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    marginTop: 50,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    //paddingTop: 15,

  },
  emailLabel: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'right',
  },
  emailInput: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    textAlign: 'right',
  },
  passwordLabel: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'right',
  },
  passwordInput: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    textAlign: 'right',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: themeColors.lightb,
    textDecorationLine: 'underline',
    fontSize: 16,

  },
  loginButton: {
    backgroundColor: themeColors.lightb,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,

  },
  signUpText: {
    marginRight: 8,
    fontWeight: '600',
    marginLeft: 5,
  },
  signUpLink: {
    color: themeColors.lightb,
    textDecorationLine: 'underline',

  },
  rememberMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,

  },
  rememberMeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8, // Adjust margin to create space between text and indicator
    borderColor: themeColors.lightb, // Border color
  },
  rememberMeIndicatorActive: {
    backgroundColor: themeColors.lightb, // Change to desired color when active
  },
  rememberMeButtonText: {
    fontSize: 16,
    color: themeColors.lightb,

  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjusted justifyContent
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,

  },
  required: {
    color: 'red',
    fontSize: 16,
    marginLeft: 5,
  },

});

