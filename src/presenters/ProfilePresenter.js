import { useState } from "react";
import { signOut } from "../models/AuthModel";
import { Alert } from "react-native";

export function useProfilePresenter(navigation, route) {
    const { givenName } = route.params;
    const [loggingOut, setLoggingOut] = useState(false);

    // Log user out and navigate back to welcome screen
    const onLogoutPress = async () => {
        if (loggingOut){
            return
        }
        setLoggingOut(true);
        try {
            // Call sign out function from AuthModel
            await signOut();
            navigation.navigate('WelcomeScreen');
        }
        catch (error) {
            // Handle any errors with signing out
            Alert.alert("Sign Out Error", error.message, [{ text: "Try Again" }]);
        }
        setLoggingOut(false);
    };

    // Navigate back to home screen
    const onBackPress = () => {
        navigation.goBack();
    };

    return {
        givenName,
        onLogoutPress,
        onBackPress,
        loggingOut
    }

}