import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomInput({ iconName, value, setValue, placeholder, secureTextEntry }) {
  return (
    <View style={styles.container}>
      <Ionicons  name={iconName} size={20} color="#a0a0a0" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={styles.textInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    paddingHorizontal: 10,
    margin: 5,
    width: 270,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#eeeeee'
  },

  icon: {
    marginRight: 10,
  },

  textInput: {
    flex: 1,
  },
});
