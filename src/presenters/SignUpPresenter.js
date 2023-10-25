// SignUpPresenter.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { signUp, signIn } from '../models/AuthModel';

export function useSignUpPresenter(navigation) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [signingUp, setSigningUp] = useState(false);

    // Sign up function
    async function onSignUpPressed() {
        // Check if passwords match
        if (signingUp || !checkPasswordMatch()) {
            return;
        }
        // Check for any empty fields
        if (firstName === '' || password === '' || email === '') {
            Alert.alert('Sign Up Failed', 'Please fill in all fields', [{ text: 'Try Again' }]);
            return;
        }

        setSigningUp(true);

        try {
            // Sign up and navigate to confirm email screen if successful
            const user = await signUp(firstName, email, password);
            const userSub = user.userSub;
            navigation.navigate("ConfirmEmailScreen", { email: email, firstName: firstName, userSub: userSub, password: password });
        } catch (error) {
            // Display alert message to user based on error
            if (error.message.includes('validation') || error.message.includes('conform')) {
                Alert.alert('Sign Up Failed', "Passwords must contain 8 or more characters, contain uppercase letters, lowercase letters, numerals, and symbols (such as !, $, %)", [{ text: 'Try Again' }]);
            } else {
                Alert.alert('Sign Up Failed', error.message.replace('Username', 'Email').replace(/validation|conform/g, 'Passwords must follow policy'), [{ text: 'Try Again' }]);
            }
        }

        setSigningUp(false);
    }

    // Navigate to sign in screen
    const onSignInPressed = () => {
        navigation.navigate("SignInScreen");
    }

    // Check if passwords match, returns boolean
    const checkPasswordMatch = () => {
        return password === passwordRepeat;
    };

    return {
        firstName,
        setFirstName,
        email,
        setEmail,
        password,
        setPassword,
        passwordRepeat,
        setPasswordRepeat,
        signingUp,
        onSignUpPressed,
        checkPasswordMatch,
        onSignInPressed
    };
}
