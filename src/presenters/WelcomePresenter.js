export function useWelcomePresenter(navigation) {
    const onSignInPress = () => {
        navigation.navigate('SignInScreen');
    };

    const onSignUpPress = () => {
        navigation.navigate('SignUpScreen');
    };

    return {
        onSignInPress,
        onSignUpPress
    }
}