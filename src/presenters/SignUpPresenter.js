import { useState } from 'react';
import { Alert } from 'react-native';
import { signUp } from '../models/AuthModel';

export function useSignUpPresenter(navigation) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [signingUp, setSigningUp] = useState(false);

    async function onSignUpPressed() {
        if (signingUp || !checkPasswordMatch()) {
            return;
        }

        setSigningUp(true);

        try {
            const user = await signUp(firstName, email, password);
            const userSub = user.userSub;
            navigation.navigate("ConfirmEmailScreen", { email: email, firstName: firstName, userSub: userSub });
        } catch (error) {
            Alert.alert('Sign Up Failed', error.message.replace('Username', 'Email'), [{ text: 'Try Again' }]);
        }

        setSigningUp(false);
    }

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
    };
}
