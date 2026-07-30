import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import EmployeeDetailCard from '../components/molecules/EmployeeDetailCard';

export default function HREmployeeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployeeDetail = useCallback(async (isRefresh = false) => {
    if (!id) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await apiClient.get(`/employee_detail.php?id=${id}`);
      if (res.data) {
        setEmployee(res.data);
      }
    } catch (err) {
      console.error("Çalışan detay hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployeeDetail(false);
  }, [fetchEmployeeDetail]);

  const onRefresh = () => {
    fetchEmployeeDetail(true);
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
        <Header
          title="Çalışan Detay Kartı"
          backgroundColor="#f7a33c"
          backButtonText="Geri Dön"
          onBackPress={() => navigation.goBack()}
        />
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#f7a33c" style={{ marginTop: 40 }} />
        ) : employee ? (
          <View style={styles.cardContainer}>
            <EmployeeDetailCard employee={employee} />
          </View>
        ) : (
          <Text style={styles.errorText}>Çalışan bilgileri bulunamadı.</Text>
        )}
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
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  errorText: {
    textAlign: 'center',
    color: '#718096',
    marginTop: 30,
    fontSize: 15,
  },
});