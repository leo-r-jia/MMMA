import { useState } from 'react';
import { Alert } from 'react-native';
import { confirmSignUp, resendCode, createUserInDatabase } from '../models/AuthModel';

// Custom hook for the Confirm Email screen logic
export function useConfirmEmailPresenter(route, navigation) {
    // Initialise states
    const [code, setCode] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [resendingCode, setResendingCode] = useState(false);

    // Function to navigate to the Sign In screen
    const onSignInPress = () => {
        navigation.navigate('SignInScreen');
    };

    // Destructure route parameters to get email, first name, and user sub
    const { email, firstName, userSub, password } = route.params;

    // Function to handle the confirmation of the user's email
    async function onConfirmPressed() {
        // Prevent multiple confirmation attempts
        if (confirming) {
            return;
        }

        setConfirming(true);

        try {
            // Call confirm sign up from AuthModel
            await confirmSignUp(email, code);
            // Create a user entry in the database
            createUserInDatabase(userSub, firstName, email);
            navigation.navigate('EmailConfirmedScreen');
        } catch (error) {
            Alert.alert('Confirmation Error', error.message, [{ text: 'Try Again' }]);
        }

        setConfirming(false);
    };

    // Execute the createUser mutation
    async function onResendPress() {
        // Prevent multiple resending attempts
        if (resendingCode) {
            return;
        }

        setResendingCode(true);

        try {
            // Call resend confirmation code function from AuthModel
            resendCode(email);
        } catch (error) {
            console.error("Resend confirmation error: ", error);
        }

        setResendingCode(false);
    };

    // Return the relevant states and functions for use in the Confirm Email screen
    return {
        code,
        setCode,
        confirming,
        onConfirmPressed,
        onResendPress,
        resendingCode,
        onSignInPress,
        email,
        firstName,
        userSub
    };
}
