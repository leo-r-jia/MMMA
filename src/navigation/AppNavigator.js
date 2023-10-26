import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeView from "../views/HomeView";
import SignInView from "../views/SignInView";
import SignUpView from "../views/SignUpView";
import ConfirmEmailView from "../views/ConfirmEmailView";
import WelcomeView from "../views/WelcomeView";
import ProfileView from "../views/ProfileView";
import EmailConfirmedView from "../views/EmailConfirmedView";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeView} />
      <Stack.Screen
        name="HomeScreen"
        component={HomeView}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="SignInScreen" component={SignInView} />
      <Stack.Screen name="SignUpScreen" component={SignUpView} />
      <Stack.Screen
        name="ConfirmEmailScreen"
        component={ConfirmEmailView}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="EmailConfirmedScreen"
        component={EmailConfirmedView}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileView} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
