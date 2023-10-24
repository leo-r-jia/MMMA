import { useState } from 'react';
import { Auth, API } from 'aws-amplify';

const CreateUserMutation = `
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

export function useConfirmEmailPresenter(navigation) {
    const [code, setCode] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [resendingCode, setResendingCode] = useState(false);

    async function onConfirmPressed(email, firstName, userSub) {
        if (confirming || code=== '') {
            return;
        }

        setConfirming(true);

        try {
            const user = await Auth.confirmSignUp(email, code);
            createUserInDatabase(email, firstName, userSub);
            navigation.navigate('HomeScreen', { email, firstName });
        } catch (error) {
            console.error("Confirmation error: ", error);
        }

        setConfirming(false);
    };

    async function createUserInDatabase(email, firstName, userSub) {
        try {
            const userData = {
                id: userSub,
                name: firstName,
                email: email,
            };

            await API.graphql({
                query: CreateUserMutation,
                variables: { input: userData },
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    async function onResendPress(email) {
        if (resendingCode) {
            return;
        }

        setResendingCode(true);

        try {
            const user = await Auth.resendSignUp(email);
        } catch (error) {
            console.error("Resend confirmation error: ", error);
        }

        setResendingCode(false);
    };

    return {
        code,
        setCode,
        confirming,
        onConfirmPressed,
        onResendPress,
        resendingCode
    };
}
