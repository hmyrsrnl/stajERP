import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HealthDetailCard({ employee }) {
  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Girilmedi';
    const date = new Date(dateString);
    return date.toString() === 'Invalid Date' ? 'Geçersiz Tarih' : date.toLocaleDateString('tr-TR');
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>Personel Sağlık Kimlik Bilgileri</Text>
      
      <Text style={styles.infoRow}>
        <Text style={styles.label}>Adı Soyadı: </Text>
        <Text style={styles.value}>{employee.first_name} {employee.last_name}</Text>
      </Text>

      <Text style={styles.infoRow}>
        <Text style={styles.label}>T.C. Kimlik No: </Text>
        <Text style={styles.value}>{employee.tc_no}</Text>
      </Text>

      <Text style={styles.infoRow}>
        <Text style={styles.label}>Departman / Unvan: </Text>
        <Text style={styles.value}>{employee.department_name} / {employee.role_name}</Text>
      </Text>

      <Text style={styles.infoRow}>
        <Text style={styles.label}>İletişim Numarası: </Text>
        <Text style={styles.value}>{employee.phone_number}</Text>
      </Text>

      <Text style={styles.infoRow}>
        <Text style={styles.label}>Kurumsal E-posta: </Text>
        <Text style={styles.value}>{employee.email}</Text>
      </Text>

      <Text style={styles.infoRow}>
        <Text style={styles.label}>İşe Başlangıç Tarihi: </Text>
        <Text style={styles.value}>{formatDate(employee.hire_date || employee.created_at)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#dff9f6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1bee7',
    marginBottom: 25,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004c43',
    marginBottom: 12,
  },
  infoRow: {
    marginVertical: 4,
    fontSize: 14,
    color: '#333333',
  },
  label: {
    fontWeight: 'bold',
    color: '#004c43',
  },
  value: {
    color: '#2d3748',
  },
});