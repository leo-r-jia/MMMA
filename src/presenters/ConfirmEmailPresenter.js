import { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { Alert } from 'react-native';

// GraphQL mutation to create a user in the database.
const CreateUserMutation = `
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

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
    const { email, firstName, userSub } = route.params;

    // Function to handle the confirmation of the user's email
    async function onConfirmPressed() {
        // Prevent multiple confirmation attempts
        if (confirming) {
            return;
        }

        setConfirming(true);

        try {
            // Confirm the user's email using AWS Amplify Auth
            await Auth.confirmSignUp(email, code);
            // Create a user entry in the database
            createUserInDatabase();
            navigation.navigate('HomeScreen', { email, firstName });
        } catch (error) {
            Alert.alert('Confirmation Error', error.message, [{ text: 'Try Again' }]);
        }

        setConfirming(false);
    };

    // Function to create a user entry in the database using GraphQL
    async function createUserInDatabase() {
        try {
            const userData = {
                id: userSub,
                name: firstName,
                email: email,
            };
            // Execute the createUser mutation
            await API.graphql({
                query: CreateUserMutation,
                variables: { input: userData },
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    // Execute the createUser mutation
    async function onResendPress() {
        // Prevent multiple resending attempts
        if (resendingCode) {
            return;
        }

        setResendingCode(true);

        try {
            // Resend the confirmation code using AWS Amplify Auth
            const user = await Auth.resendSignUp(email);
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
