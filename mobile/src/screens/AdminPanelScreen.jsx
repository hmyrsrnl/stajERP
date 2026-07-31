import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import Header from '../components/organisms/Header';
import apiClient from '../api/client';

export default function AdminPanelScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingRequests: 0,
    activeCertificates: 0,
  });

  useEffect(() => {
    apiClient.get('/admin_stats.php')
      .then(res => {
        if (res.data) {
          setStats({
            totalEmployees: res.data.totalEmployees || 0,
            totalDepartments: res.data.totalDepartments || 0,
            pendingRequests: res.data.pendingRequests || 0,
            activeCertificates: res.data.activeCertificates || 0,
          });
        }
      })
      .catch(err => {
        console.error("İstatistikler veritabanından çekilemedi:", err);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header
        title="Sistem Yönetim Merkezi"
        backgroundColor="#b22a2a"
        backPath="DashboardSelection"
        backButtonText="Kontrol Merkezi"
      />

      <View style={styles.contentPadding}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#5c7cfa' }]}>
            <Text style={styles.statNumber}>{stats.totalEmployees}</Text>
            <Text style={styles.statLabel}>Toplam Personel</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#20c997' }]}>
            <Text style={styles.statNumber}>{stats.totalDepartments}</Text>
            <Text style={styles.statLabel}>Aktif Departman</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#f59f00' }]}>
            <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Bekleyen Talep</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#845ef7' }]}>
            <Text style={styles.statNumber}>{stats.activeCertificates}</Text>
            <Text style={styles.statLabel}>Tanımlı Sertifika</Text>
          </View>
        </View>


        <View style={styles.quickNavContainer}>
          <Text style={styles.quickNavTitle}>Hızlı Geçişler</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navButton}
            onPress={() => navigation.navigate('HRPanel')}
          >
            <Text style={styles.navButtonText}>İnsan Kaynakları Paneline Git</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navButton}
            onPress={() => navigation.navigate('QCPanel')}
          >
            <Text style={styles.navButtonText}>Kalite Kontrol Paneline Git</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navButton}
            onPress={() => navigation.navigate('InfirmaryPanel')}
          >
            <Text style={styles.navButtonText}>Revir Paneline Git</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },

  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  quickNavContainer: {
    gap: 12,
  },
  quickNavTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  navButton: {
    backgroundColor: '#b22a2a',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});