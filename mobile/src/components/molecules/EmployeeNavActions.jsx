import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../atoms/Button';

export default function EmployeeNavActions({ onNavigate }) {
  const navigation = useNavigation();

  const handleNavigate = (screenName) => {
    if (onNavigate) {
      onNavigate(screenName);
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => handleNavigate('ChangePassword')}
        style={[styles.actionButton, { backgroundColor: '#5484a4' }]}
        textStyle={styles.buttonText}
      >
        Şifremi Değiştir
      </Button>

      <Button
        onPress={() => handleNavigate('DepartmentRequests')}
        style={[styles.actionButton, { backgroundColor: '#5484a4' }]}
        textStyle={styles.buttonText}
      >
        Departman Taleplerinde Bulun
      </Button>

      <Button
        onPress={() => handleNavigate('PastExaminations')}
        style={[styles.actionButton, { backgroundColor: '#5e93b7' }]}
        textStyle={styles.buttonText}
      >
        Geçmiş Muayeneleri Gör
      </Button>

      <Button
        onPress={() => handleNavigate('Certificates')}
        style={[styles.actionButton, { backgroundColor: '#669fc5' }]}
        textStyle={styles.buttonText}
      >
        Sertifikalarımı Görüntüle
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    paddingVertical: 18,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});