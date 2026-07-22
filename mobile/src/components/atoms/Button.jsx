import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ 
  children, 
  onPress,        
  variant = 'primary', 
  style, 
  textStyle,
  disabled,
  ...props 
}) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isPrimary ? styles.primaryBg : styles.secondaryBg,
        disabled && styles.disabledBg,
        style, 
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primaryBg: {
    backgroundColor: '#87bbf2', 
  },
  secondaryBg: {
    backgroundColor: '#6c757d', 
  },
  disabledBg: {
    backgroundColor: '#cbd5e1',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});