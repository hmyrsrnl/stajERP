import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/organisms/Header';

export default function DashboardSelectionScreen({ navigation }) {
  const [systemRole, setSystemRole] = useState('calısan');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('system_role');
        if (role) {
          setSystemRole(role.toLowerCase());
        }
      } catch (error) {
        console.error('Rol okunurken hata oluştu:', error);
      }
    };

    fetchUserRole();
  }, []);

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
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  
  const panels = [
    {
      id: 'admin_panel',
      title: 'Sistem Yönetim Paneli',
      description: 'Tüm sistem ayarları, loglar ve tam yetkili kontrol merkezi.',
      screenName: 'AdminPanel',
      allowedRoles: ['admin']
    },
    {
      id: 'hr_panel',
      title: 'İnsan Kaynakları Paneli',
      description: 'Personel kayıtları, işe alım, maaş ve özlük işleri yönetimi.',
      screenName: 'HrPanel',
      allowedRoles: ['admin', 'ik']
    },
    {
      id: 'qc_panel',
      title: 'Kalite Kontrol Paneli',
      description: 'Kaynakçı sertifikasyonları, teknik belgeler ve kalite takibi.',
      screenName: 'QcPanel',
      allowedRoles: ['admin', 'kk']
    },
    {
      id: 'infirmary_panel',
      title: 'Sağlık İşleri Paneli',
      description: 'Periyodik muayeneler, ağır iş görebilir raporları ve sağlık takibi.',
      screenName: 'InfirmaryPanel',
      allowedRoles: ['admin', 'revir']
    },
    {
      id: 'employee_panel',
      title: 'Kişisel Çalışan Portalı',
      description: 'Kendi profil bilgileriniz, sertifikalarınız ve departman talepleriniz.',
      screenName: 'EmployeeDashboard',
      allowedRoles: ['admin', 'ik', 'revir', 'kk', 'calısan']
    }
  ];

  const accessiblePanels = panels.filter(panel => panel.allowedRoles.includes(systemRole));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header
        title="ERP Kontrol Merkezi"
        backgroundColor="#1e293b"
        backButtonText="Çıkış Yap"
        backPath="Login"
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Lütfen Giriş Yapmak İstediğiniz Modülü Seçin
        </Text>

        <View style={styles.gridContainer}>
          {accessiblePanels.map(panel => (
            <TouchableOpacity
              key={panel.id}
              activeOpacity={0.7}
              style={styles.card}
              onPress={() => navigation.navigate(panel.screenName)}
            >
              <Text style={styles.cardTitle}>{panel.title}</Text>
              <Text style={styles.cardDescription}>{panel.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  content: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    gap: 15, 
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
});