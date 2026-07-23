import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function NotificationButton({ onPress, onClick, disabled, style, textStyle }) {
  
  const handlePress = onPress || onClick;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonActive,
        style
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          disabled ? styles.textDisabled : styles.textActive,
          textStyle
        ]}
      >
        🔔 Bildir
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  buttonActive: {
    backgroundColor: '#ebf8ff',
    borderColor: '#bee3f8',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
    borderColor: '#cbd5e0',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textActive: {
    color: '#3182ce',
  },
  textDisabled: {
    color: '#a0aec0',
  },
});