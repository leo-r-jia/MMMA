// AuthModel.js
import { Auth, API } from "aws-amplify";

export async function signIn(email, password) {
    try {
        const user = await Auth.signIn(email, password);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function signUp(firstName, email, password) {
    try {
        const user = await Auth.signUp({
            username: email,
            password,
            attributes: {
                given_name: firstName
            },
            autoSignIn: {
                enabled: true,
            }
        });
        return user;
    } catch (error) {
        throw error;
    }
}

export async function confirmSignUp(email, code) {
    try {
        await Auth.confirmSignUp(email, code);
    } catch (error) {
        throw error;
    }
}

export async function resendCode(email) {
    try {
        await await Auth.resendSignUp(email);
    } catch (error) {
        throw error;
    }
}

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

export async function createUserInDatabase(userSub, firstName, email) {
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
}

export async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        throw error;
    }
}