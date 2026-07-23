import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from '../atoms/Checkbox';

export default function FilterGroup({ title, items = [], selectedItems = [], onItemChange, style }) {
  return (
    <View style={[styles.container, style]}>
      {title ? (
        <Text style={styles.title}>
          {title}
        </Text>
      ) : null}

      {items?.map((item, index) => (
        <Checkbox 
          key={index}
          label={item}
          checked={selectedItems.includes(item)}
          onChange={() => onItemChange && onItemChange(item)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    fontSize: 14,
  },
});