import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../views/HomeScreen';
import SignInScreen from '../views/SignInScreen';
import SignUpScreen from '../views/SignUpScreen';
import ConfirmEmailScreen from '../views/ConfirmEmailScreen';
import WelcomeScreen from '../views/WelcomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />  
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />   
      <Stack.Screen name="ConfirmEmailScreen" component={ConfirmEmailScreen} options={{ gestureEnabled: false }} />    
    </Stack.Navigator>
  );
};

export default AppNavigator;
