import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Textarea({ 
  value, 
  onChangeText, 
  onChange, 
  placeholder, 
  rows = 4, 
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

  
  const calculatedMinHeight = rows * 20 + 20;

  return (
    <TextInput
      value={value}
      onChangeText={handleTextChange}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      multiline={true} 
      numberOfLines={rows} 
      textAlignVertical="top" 
      style={[
        styles.textarea, 
        { minHeight: calculatedMinHeight }, 
        style
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    width: '100%',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
});