import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import FilterPanel from '../components/organisms/FilterPanel';
import EmployeeTable from '../components/organisms/EmployeeTable';

export default function QCPanelScreen({ navigation }) {
  const [welders, setWelders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchWeldersData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await apiClient.get('/quality_control.php?action=get_welders');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setWelders(data);
    } catch (err) {
      console.error("Mobil KK Veri Çekme Hatası:", err);
      setWelders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeldersData();
  }, []);

  const onRefresh = () => {
    fetchWeldersData(true);
  };

  const welderList = Array.isArray(welders) ? welders : [];

  const handleStatusChange = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredWelders = welderList.filter(emp => {
    const fullName = `${emp.first_name || emp.Ad || ''} ${emp.last_name || emp.Soyad || ''}`.toLowerCase();
    const matchesSearch = searchTerm.trim() === '' || fullName.includes(searchTerm.trim().toLowerCase());

    const currentStatus = String(emp.status || emp.Status || 'Aktif').trim();
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.some(
      s => s.toLowerCase() === currentStatus.toLowerCase()
    );

    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Oturumunuz kapatılacaktır. Emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
      }
    ]);
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#76399c']} />
      }
    >
      <Header title="Kalite Kontrol Paneli" backgroundColor="#76399c" />

      <View style={styles.topActionBar}>
        <TouchableOpacity
          style={styles.analyticsBtn}
          onPress={() => navigation.navigate('QCAnalytics', { weldersData: filteredWelders })}
        >
          <Text style={styles.analyticsBtnText}>Kalite Kontrol Analitiği</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.toggleFilterBtn}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.toggleFilterText}>
          {showFilters ? "Filtreleri Gizle " : "Arama & Filtreleme Seçenekleri "}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          showDepartments={false}
          showGenders={false}
          themeColor="#76399c"
          style={{ marginBottom: 12 }}
        />
      )}

      <View style={styles.tableCard}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableTitle}>Kayıtlı Kaynakçılar</Text>
          <Text style={styles.badgeText}>{filteredWelders.length} Personel</Text>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#76399c" style={{ marginVertical: 30 }} />
        ) : (
          <EmployeeTable
            employees={filteredWelders}
            allEmployeesLength={welderList.length}
            onSelectEmployee={(emp) => navigation.navigate('QCEmployeeDetail', { id: emp.id })}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  analyticsBtn: {
    flex: 1,
    backgroundColor: '#8e5dad', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  analyticsBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: '#e53e3e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  toggleFilterBtn: {
    backgroundColor: '#8e5dad',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8e5dad',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleFilterText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  badgeText: {
    backgroundColor: '#f3e8ff',
    color: '#76399c',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});