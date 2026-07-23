import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function Checkbox({ label, checked, onChange, onValueChange, style }) {
 
  const handlePress = () => {
    const newValue = !checked;
    if (onValueChange) {
      onValueChange(newValue);
    } else if (onChange) {
     
      onChange(newValue);
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={handlePress} 
      style={[styles.container, style]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {label ? <Text style={styles.label}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#adb5bd',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  boxChecked: {
    backgroundColor: '#2b5876', 
    borderColor: '#2b5876',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2, 
  },
  label: {
    fontSize: 14,
    color: '#495057',
  },
});