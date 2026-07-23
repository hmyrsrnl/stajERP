import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

import Header from '../components/organisms/Header';
import NotificationBanner from '../components/molecules/NotificationBanner';
import ProfileInfoCard from '../components/molecules/ProfileInfoCard';
import EmployeeNavActions from '../components/molecules/EmployeeNavActions';

export default function EmployeeDashboardScreen({ navigation }) {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeId = await AsyncStorage.getItem('employee_id');

        if (!employeeId || employeeId === "null") {
          Alert.alert("Hata", "Lütfen önce sisteme giriş yapın!");
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const empRes = await apiClient.get(`/employee_detail.php?id=${employeeId}`);
        if (empRes.data) {
          setEmployeeInfo(empRes.data);
        }

        const noteRes = await apiClient.get(`/notifications.php?action=list&employee_id=${employeeId}`);
        if (Array.isArray(noteRes.data)) {
          setNotifications(noteRes.data);
        }

      } catch (err) {
        console.error("Çalışan paneli veri hatası:", err);
        Alert.alert("Hata", "Oturum bilgileri doğrulanırken bir hata oluştu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Oturumunuz kapatılacaktır. Emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('employee_id');
            await AsyncStorage.removeItem('user');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  if (loading || !employeeInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b5876" />
        <Text style={styles.loadingText}>Oturumunuz kontrol ediliyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header
        title={`Hoş Geldiniz, ${employeeInfo.first_name} ${employeeInfo.last_name}`}
        backgroundColor="#2b5876"
        backButtonText="Çıkış Yap"
        backPath="Login"
      />

      <NotificationBanner notifications={notifications} />

      <View style={styles.mainContent}>
        <ProfileInfoCard employeeInfo={employeeInfo} />

        <EmployeeNavActions 
          onNavigate={(screenName) => navigation.navigate(screenName)} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#334155',
  },
  mainContent: {
    marginTop: 15,
    gap: 20, 
  },
});