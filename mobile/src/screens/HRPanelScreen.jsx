import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import FilterPanel from '../components/organisms/FilterPanel';
import EmployeeTable from '../components/organisms/EmployeeTable';

export default function HRPanelScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchEmployeesData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const endpoint = searchTerm.trim() !== ''
        ? `/employees.php?search=${encodeURIComponent(searchTerm.trim())}`
        : '/employees.php';

      const res = await apiClient.get(endpoint);

      if (Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error("Mobil İK Veri Çekme Hatası:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEmployeesData(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchEmployeesData]);

  const onRefresh = () => {
    fetchEmployeesData(true);
  };

  const employeeList = Array.isArray(employees) ? employees : [];

  const departmentsList = [
    ...new Set(employeeList.map(emp => emp.department_name).filter(Boolean))
  ];

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const handleDeptChange = (dept) => {
    setSelectedDepts(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredEmployees = employeeList.filter(emp => {
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(emp.gender || emp.Cinsiyet);
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(emp.department_name);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(emp.status || emp.Status);

    return matchesGender && matchesDept && matchesStatus;
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#f7a33c" />
      
      

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f7a33c']}
            tintColor="#f7a33c"
          />
        }
      >
        <Header title="İnsan Kaynakları Paneli" backgroundColor="#f7a33c" />
        
        <View style={styles.topActionBar}>
          <TouchableOpacity
            style={styles.analyticsBtn}
            onPress={() => navigation.navigate('HRAnalytics', { employeesData: filteredEmployees })}
          >
            <Text style={styles.analyticsBtnText}>Grafikler & Raporlar</Text>
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
            departments={departmentsList}
            selectedGenders={selectedGenders}
            onGenderChange={handleGenderChange}
            selectedDepts={selectedDepts}
            onDeptChange={handleDeptChange}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            themeColor="#f7a33c"
            style={{ marginBottom: 15 }}
          />
        )}

        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableTitle}>Kayıtlı Çalışanlar</Text>
            <Text style={styles.badgeText}>{filteredEmployees.length} Personel</Text>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#f7a33c" style={{ marginVertical: 30 }} />
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              allEmployeesLength={employeeList.length}
              onSelectEmployee={(emp) => navigation.navigate('HREmployeeDetail', { id: emp.id })}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7a33c',
  },
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
    backgroundColor: '#f9b25b',
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
    backgroundColor: '#f9b25b',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e0',
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
    width: '100%',
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
    backgroundColor: '#feebc8',
    color: '#c05621',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});