//WelcomePresenter.js
export function useWelcomePresenter(navigation) {
  // Navigate to sign in screen
  const onSignInPress = () => {
    navigation.navigate("SignInScreen");
  };

  // Navigate to sign up screen
  const onSignUpPress = () => {
    navigation.navigate("SignUpScreen");
  };

  return {
    onSignInPress,
    onSignUpPress,
  };
}
