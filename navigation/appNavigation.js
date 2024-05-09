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
import RecommendationsScreen from '../screens/RecommendationsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ConnectScreen from '../screens/ConnectScreen';
import ConnectSteps from '../screens/ConnectSteps';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import DeviceConnectionScreen from '../screens/DeviceConnectionScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import OutletsScreen from '../screens/OutletsScreen';

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