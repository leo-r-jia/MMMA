// ConfirmEmailView.js
import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useConfirmEmailPresenter } from "../presenters/ConfirmEmailPresenter";

// Confirm email screen of the MMMA
function ConfirmEmailScreen({ route, navigation }) {
  // Initialise and destructure various states and functions using the ConfirmEmailPresenter
  const {
    code,
    setCode,
    confirming,
    onConfirmPressed,
    onResendPress,
    resendingCode,
    onSignInPress,
    email,
    firstName,
    userSub,
  } = useConfirmEmailPresenter(route, navigation);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
    >
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Confirm your email</Text>
          <Text style={styles.text}>
            Hi {firstName}. Enter the 6-digit code we sent to {email}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <CustomInput
            placeholder="Enter your confirmation code"
            value={code}
            setValue={setCode}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.footerContainer}>
          <CustomButton
            text={confirming ? "Confirming..." : "Confirm"}
            onPress={onConfirmPressed}
          />

          <CustomButton
            text={resendingCode ? "Resending Code..." : "Resend Code"}
            onPress={onResendPress}
            type="SECONDARY"
          />

          <CustomButton
            text="Back to Sign in"
            onPress={onSignInPress}
            type="TERTIARY"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles for components of the confirm email view
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
    fontSize: 40,
    fontWeight: "700",
    color: "#3a58e0",
  },
  text: {
    fontSize: 16,
    color: "#3a58e0",
    paddingTop: 20,
  },
  headingContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
  },
  inputContainer: {
    width: "85%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    width: "85%",
    alignItems: "center",
    gap: 0,
    flex: 3,
    paddingTop: 5,
  },
});

export default ConfirmEmailScreen;
