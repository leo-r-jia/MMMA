// SignInPresenter.js
import { useState } from "react";
import { signIn } from "../models/AuthModel";

export function useSignInPresenter( navigation ) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState(null);

    async function onSignInPressed() {
        if (signingIn) {
            return;
        }

        setSigningIn(true);

        try {
            const user = await signIn(email, password);
            navigation.navigate("HomeScreen");
        } catch (error) {
            setError(error);
        }

        setSigningIn(false);
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        signingIn,
        onSignInPressed,
        error
    };
}
