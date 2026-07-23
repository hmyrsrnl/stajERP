import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationBadge({ count, style, textStyle }) {

  if (!count || count === 0) return null;

  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.badgeText, textStyle]}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#e53e3e',
    borderRadius: 12,           
    paddingVertical: 2,        
    paddingHorizontal: 8,       
    marginLeft: 8,             
    alignSelf: 'center',       
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,               
    fontWeight: 'bold',         
  },
});