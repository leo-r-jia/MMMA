// AuthModel.js
import { Auth } from "aws-amplify";

export async function signIn(email, password) {
    try {
        await Auth.signOut();
        const user = await Auth.signIn(email, password);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function signUp(firstName, email, password) {
    try {
        await Auth.signOut();
        const user = await Auth.signUp({ username: email, password, attributes: { given_name: firstName } });
        return user;
    } catch (error) {
        throw error;
    }
}