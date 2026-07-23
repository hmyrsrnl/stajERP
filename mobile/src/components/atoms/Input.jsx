import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Input({ 
  type = 'text', 
  value, 
  onChangeText, 
  onChange, 
  placeholder, 
  style,
  ...props 
}) {
 
  const handleTextChange = (text) => {
    if (onChangeText) {
      onChangeText(text);
    } else if (onChange) {
      onChange(text);
    }
  };


  const isPassword = type === 'password';
  
  let keyboardType = 'default';
  if (type === 'email') keyboardType = 'email-address';
  if (type === 'number' || type === 'tc_no') keyboardType = 'numeric';
  if (type === 'phone_number' || type === 'phone') keyboardType = 'phone-pad';

  return (
    <TextInput
      value={value}
      onChangeText={handleTextChange}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      secureTextEntry={isPassword}
      keyboardType={keyboardType}
      autoCapitalize={type === 'email' ? 'none' : 'sentences'}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
});