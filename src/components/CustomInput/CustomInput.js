import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, keyboardType, autoCapitalize }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',

    borderColor: 'white',
    borderWidth: 1,
    borderBottomColor: '#e8e8e8',

    paddingHorizontal: 10,
    marginVertical: 2,

    height: 50,
    paddingBottom: 10,
    justifyContent: 'flex-end'
  },
  input: {
    fontSize: 16
  },
});

export default CustomInput;
