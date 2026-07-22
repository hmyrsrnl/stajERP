import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormField({ 
  label, 
  type = 'text', 
  value, 
  onChangeText, 
  placeholder, 
  style,
  inputStyle,
  secureTextEntry, 
  keyboardType = 'default', 
  ...props 
}) {
  const isPassword = type === 'password' || secureTextEntry;
  const resolvedKeyboardType = type === 'email' ? 'email-address' : keyboardType;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a0aec0"
        secureTextEntry={isPassword}
        keyboardType={resolvedKeyboardType}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        style={[styles.input, inputStyle]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
    textAlign: 'left',
    fontSize: 14,
    color: '#2d3748',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4, 
    borderWidth: 1,  
    borderColor: '#ccc', 
    fontSize: 14,    
    backgroundColor: '#ffffff',
    color: '#1a202c',
  },
});