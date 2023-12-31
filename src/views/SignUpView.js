// SignUpView.js
import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useSignUpPresenter } from "../presenters/SignUpPresenter";

// Sign up screen of the MMMA
function SignUpView({ navigation }) {
  // Initialise and destructure various states and functions using the SignUpPresenter
  const {
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
    onSignInPressed,
  } = useSignUpPresenter(navigation);

  return (
    <View style={styles.white}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior="height"
        keyboardVerticalOffset={50}
      >
        <View style={styles.container}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Sign Up</Text>
          </View>
          <View style={styles.inputContainer}>
            <CustomInput
              placeholder="First Name"
              value={firstName}
              setValue={setFirstName}
            />
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
            <CustomInput
              placeholder="Confirm Password"
              value={passwordRepeat}
              setValue={setPasswordRepeat}
              secureTextEntry
            />
            {!checkPasswordMatch() && (
              <Text style={styles.errorText}>Passwords must match</Text>
            )}
            <View style={styles.buttonContainer}>
              <CustomButton
                text={signingUp ? "Signing Up..." : "Sign Up"}
                onPress={onSignUpPressed}
              />
            </View>
            <CustomButton
              text="Have an account? Sign in"
              onPress={onSignInPressed}
              type="TERTIARY"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Styles for components in SignUpView
const styles = StyleSheet.create({
  white: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  buttonContainer: {
    marginTop: 15,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 15,
  },
});

export default SignUpView;
