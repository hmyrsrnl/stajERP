import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import EmployeeDetailCard from '../components/molecules/EmployeeDetailCard';

export default function EmployeeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiClient.get(`/employee_detail.php?id=${id}`)
        .then(res => {
          if (res.data) setEmployee(res.data);
        })
        .catch(err => {
          console.error("Çalışan detay hatası:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Header
        title="Çalışan Detay Kartı"
        backgroundColor="#f7a33c"
        backButtonText="Geri Dön"
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#f7a33c" style={{ marginTop: 40 }} />
      ) : employee ? (
        <View style={styles.cardContainer}>
          <EmployeeDetailCard employee={employee} />
        </View>
      ) : (
        <Text style={styles.errorText}>Çalışan bilgileri bulunamadı.</Text>
      )}
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