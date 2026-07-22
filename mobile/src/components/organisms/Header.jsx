import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../atoms/Button';

export default function Header({ 
  title, 
  backgroundColor = '#00796b', 
  backPath, 
  backButtonText = 'Geri Dön', 
  children 
}) {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const userRole = await AsyncStorage.getItem('system_role');
        setIsAdmin(userRole?.toLowerCase() === 'admin');
      } catch (error) {
        console.error('Rol okunurken hata oluştu:', error);
      }
    };
    checkRole();
  }, []);

  const handleBackPress = (targetRoute) => {
    if (targetRoute) {
      navigation.navigate(targetRoute);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
     
      navigation.navigate('DashboardSelection');
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <Text style={styles.titleText}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {isAdmin && !backPath && (
          <Button 
            onPress={() => handleBackPress('DashboardSelection')} 
            style={styles.backButton}
            textStyle={styles.backButtonText}
          >
            Geri Dön
          </Button>
        )}

        {children}

        {backPath && (
          <Button 
            onPress={() => handleBackPress(backPath)} 
            style={styles.backButton}
            textStyle={styles.backButtonText}
          >
            {backButtonText}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});