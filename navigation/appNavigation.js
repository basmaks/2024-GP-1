import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import useAuth from '../hooks/useAuth';
import SettingsScreen from '../screens/SettingsScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';//not anymore
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ConnectScreen from '../screens/connectionSteps/ConnectScreen';
import ConnectSteps from '../screens/ConnectSteps';
import ContactUsScreen from '../screens/ContactUsScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import DeviceConnectionScreen from '../screens/DeviceConnectionScreen';
import Support from '../screens/connectionSteps/Support';
import OutletsScreen from '../screens/OutletsScreen';
import ConStep0 from '../screens/connectionSteps/ConStep0';
import ConStep1 from '../screens/connectionSteps/ConStep1';
import ConStep2 from '../screens/connectionSteps/ConStep2';
import ConStep3 from '../screens/connectionSteps/ConStep3';
import ConStep4 from '../screens/connectionSteps/ConStep4';
import ConStep5 from '../screens/connectionSteps/ConStep5';
import ConStep6 from '../screens/connectionSteps/ConStep6';
import ConStep7 from '../screens/connectionSteps/ConStep7';
import ConStep8 from '../screens/connectionSteps/ConStep8';
import ConStep9 from '../screens/connectionSteps/ConStep9';
import ConStep10 from '../screens/connectionSteps/ConStep10';
import ConStep11 from '../screens/connectionSteps/ConStep11';
import ConStep12 from '../screens/connectionSteps/ConStep12';
import ConStep13 from '../screens/connectionSteps/ConStep13';
import ConStep14 from '../screens/connectionSteps/ConStep14';
import ConStep15 from '../screens/connectionSteps/ConStep15';


const Stack = createNativeStackNavigator();


export default function AppNavigation() {
  const {user} = useAuth();
  if(user){
    return (
      <NavigationContainer>
        <Stack.Navigator  initialRouteName='Home'
          screenOptions={{
            animation: 'none', // Specify the animation type here
            headerShown: false, // Hide the header for all screens
          }}>
          <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
          <Stack.Screen name="Analytics" options={{headerShown: false}} component={AnalyticsScreen} />
          <Stack.Screen name="Recommendations" options={{headerShown: false}} component={RecommendationsScreen} />
          <Stack.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen} />
          <Stack.Screen name="Alerts" options={{headerShown: false}} component={AlertsScreen} />
          <Stack.Screen name="EditProfile" options={{headerShown: false}} component={EditProfileScreen} />
          <Stack.Screen name="ConnectScreen" options={{headerShown: false}} component={ConnectScreen} />
          <Stack.Screen name="ConnectSteps" options={{headerShown: false}} component={ConnectSteps} />
          <Stack.Screen name="ChangePassword" options={{headerShown: false}} component={ChangePasswordScreen}/>
          <Stack.Screen name="DeviceConnection" options={{headerShown: false}} component={DeviceConnectionScreen}/>
          <Stack.Screen name="ContactUs" options={{headerShown: false}} component={ContactUsScreen}/>
          <Stack.Screen name="Outlets" options={{headerShown: false}} component={OutletsScreen}/>
          <Stack.Screen name="Step0" options={{headerShown: false}} component={ConStep0}/>
          <Stack.Screen name="Step1" options={{headerShown: false}} component={ConStep1}/>
          <Stack.Screen name="Step2" options={{headerShown: false}} component={ConStep2}/>
          <Stack.Screen name="Step3" options={{headerShown: false}} component={ConStep3}/>
          <Stack.Screen name="Step4" options={{headerShown: false}} component={ConStep4}/>
          <Stack.Screen name="Step5" options={{headerShown: false}} component={ConStep5}/>
          <Stack.Screen name="Step6" options={{headerShown: false}} component={ConStep6}/>
          <Stack.Screen name="Step7" options={{headerShown: false}} component={ConStep7}/>
          <Stack.Screen name="Step8" options={{headerShown: false}} component={ConStep8}/>
          <Stack.Screen name="Step9" options={{headerShown: false}} component={ConStep9}/>
          <Stack.Screen name="Step10" options={{headerShown: false}} component={ConStep10}/>
          <Stack.Screen name="Step11" options={{headerShown: false}} component={ConStep11}/>
          <Stack.Screen name="Step12" options={{headerShown: false}} component={ConStep12}/>
          <Stack.Screen name="Step13" options={{headerShown: false}} component={ConStep13}/>
          <Stack.Screen name="Step14" options={{headerShown: false}} component={ConStep14}/>
          <Stack.Screen name="Step15" options={{headerShown: false}} component={ConStep15}/>
          <Stack.Screen name="Support" options={{headerShown: false}} component={Support} />

  

        </Stack.Navigator>
      </NavigationContainer>
    )
  }else{
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
          <Stack.Screen name="ForgetPassword" options={{headerShown: false}} component={ForgetPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
}