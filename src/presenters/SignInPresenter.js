// SignInPresenter.js
import { useState } from "react";
import { signIn } from "../models/AuthModel";
import { Alert } from "react-native";

// Custom hook for the Sign In screen logic
export function useSignInPresenter(navigation) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signingIn, setSigningIn] = useState(false);

    // Navigate to sign up screen
    const onSignUpPress = () => {
        navigation.navigate("SignUpScreen");
    };

    // Sign in function
    async function onSignInPressed() {
        // Prevent multiple sign in attempts
        if (signingIn) {
            return;
        }

        setSigningIn(true);

        try {
            // Call sign in from AuthModel
            await signIn(email, password);
            navigation.navigate("HomeScreen");
        } catch (error) {
            // Handle any sign in errors
            Alert.alert("Sign In Failed", error.message.replace("Username", "Email").replace('Custom auth lambda trigger is not configured for the user pool', 'Please enter valid account details'), [
                { text: "Try Again" },
            ]);
        } finally {
            setSigningIn(false);
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        signingIn,
        onSignInPressed,
        onSignUpPress,
    };
}
