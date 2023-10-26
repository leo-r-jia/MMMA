// SignInView.js
import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useSignInPresenter } from "../presenters/SignInPresenter";

// Sign in screen of the MMMA
function SignInView({ navigation }) {
  // Initialise and destructure various states and functions using the SignInPresenter
  const {
    email,
    setEmail,
    password,
    setPassword,
    signingIn,
    onSignInPressed,
    onSignUpPress,
  } = useSignInPresenter(navigation);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
    >
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Welcome Back</Text>
        </View>
        <View style={styles.inputContainer}>
          <CustomInput
            placeholder="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <CustomButton
              style={styles.button}
              text={signingIn ? "Signing In..." : "Sign In"}
              onPress={onSignInPressed}
            />
          </View>

          <View style={styles.footerContainer}>
            <CustomButton
              text="Don't have an account? Create one"
              onPress={onSignUpPress}
              type="TERTIARY"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles for components of the sign in view
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: 60,
    fontWeight: "700",
    color: "#3a58e0",
  },
  headingContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
  },
  inputContainer: {
    width: "85%",
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    alignItems: "center",
    gap: 0,
    flex: 1,
    paddingTop: 5,
  },
  buttonContainer: {
    marginTop: 15,
    width: "100%",
  },
});

export default SignInView;
