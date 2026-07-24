import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginForm from '../components/organisms/LoginForm'; 
import apiClient from '../api/client';

export default function LoginScreen({ navigation }) {
  const [message, setMessage] = useState('');

  const handleLogin = async (loginData) => {
    setMessage('');

    try {
      const res = await apiClient.post('/login.php', loginData);

      if (res.data && res.data.user) {
        const userData = res.data.user;

        await AsyncStorage.setItem('employee_id', String(userData.id));
        await AsyncStorage.setItem('system_role', userData.role);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        Alert.alert(
          "Başarılı",
          "Giriş başarıyla gerçekleşti! Kontrol merkezine yönlendiriliyorsunuz.",
          [
            {
              text: "Tamam",
              onPress: () => navigation.navigate('DashboardSelection') 
            }
          ]
        );
      }
    } catch (err) {
      console.error("Giriş hatası:", err);

      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Giriş yapılırken bir hata oluştu veya sunucuya erişilemedi.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>ERP GİRİŞ PANELİ</Text>

        <LoginForm 
          onSubmit={handleLogin}
          errorMessage={message}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400, 
    padding: 30,    
    borderWidth: 1, 
    borderColor: '#ccc',
    borderRadius: 8, 
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f472e9', 
    marginBottom: 20,
    textAlign: 'center',
  },
});