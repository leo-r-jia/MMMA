import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useConfirmEmailPresenter } from '../presenters/ConfirmEmailPresenter';

function ConfirmEmailScreen({ route, navigation }) {
  const {
    code,
    setCode,
    confirming,
    onConfirmPressed,
    onResendPress,
    resendingCode
  } = useConfirmEmailPresenter(navigation);

  const { email, firstName, userSub } = route.params;

  const onSignInPress = () => {
    navigation.navigate('SignInScreen');
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Confirm your email</Text>
          <Text style={styles.text}>Hi {firstName}. Enter the 6-digit code we sent to {email}</Text>
        </View>

        <View style={styles.inputContainer}>
          <CustomInput
            placeholder="Enter your confirmation code"
            value={code}
            setValue={setCode}
            keyboardType='numeric'
          />
        </View>

        <View style={styles.footerContainer}>
          <CustomButton
            text={confirming ? 'Confirming...' : 'Confirm'}
            onPress={() => onConfirmPressed(email, firstName, userSub)}
          />

          <CustomButton
            text={resendingCode ? 'Resending Code...' : 'Resend Code'}
            onPress={() => onResendPress(email)}
            type="SECONDARY"
          />

          <CustomButton
            text="Back to Sign in"
            onPress={onSignInPress}
            type="TERTIARY"
          />
        </View>

      </View>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%'
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: '#3a58e0',
  },
  text: {
    fontSize: 16,
    color: '#3a58e0',
    paddingTop: 20
  },
  headingContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '85%',
  },
  inputContainer: {
    width: '85%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerContainer: {
    width: '85%',
    alignItems: 'center',
    gap: 0,
    flex: 3,
    paddingTop: 5
  }
});

export default ConfirmEmailScreen;
