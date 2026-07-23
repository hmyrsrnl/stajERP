import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormTextarea({ 
  label, 
  value, 
  onChangeText, 
  onChange, 
  placeholder, 
  rows = 4, 
  style, 
  inputStyle 
}) {
 
  const handleChange = (text) => {
    if (onChangeText) {
      onChangeText(text);
    } else if (onChange) {
      onChange(text);
    }
  };

 
  const calculatedHeight = Math.max(80, rows * 20);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        multiline={true}
        numberOfLines={rows}
        textAlignVertical="top" 
        style={[
          styles.textarea, 
          { minHeight: calculatedHeight },
          inputStyle
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
    color: '#333333',
  },
  textarea: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
});