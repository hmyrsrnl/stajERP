import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeeDetailCard({ employee, style }) {
  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Girilmedi';
    const date = new Date(dateString);
    return date.toString() === 'Invalid Date' ? 'Geçersiz Tarih' : date.toLocaleDateString('tr-TR');
  };

  const getStatusColor = (status) => {
    if (!status) return '#10b981';
    const lower = String(status).toLowerCase();
    if (lower.includes('aktif')) return '#10b981';
    if (lower.includes('pasif')) return '#ef4444';
    if (lower.includes('izin')) return '#f59e0b';
    return '#64748b';
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Ad Soyad:</Text>
        <Text style={styles.value}>{employee.first_name} {employee.last_name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>T.C. No:</Text>
        <Text style={styles.value}>{employee.tc_no || 'Girilmedi'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Görev / Departman:</Text>
        <Text style={styles.value}>{employee.role_name || employee.department_name || 'Girilmedi'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Durum:</Text>
        <Text style={[styles.statusText, { color: getStatusColor(employee.status) }]}>
          {employee.status || 'Aktif'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.label}>E-posta:</Text>
        <Text style={styles.value}>{employee.email || 'Girilmedi'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>{employee.phone_number || 'Girilmedi'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Ev Adresi:</Text>
        <Text style={[styles.value, { flex: 1 }]}>{employee.home_address || 'Girilmedi'}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.label}>Oluşturulma Tarihi:</Text>
        <Text style={styles.value}>{formatDate(employee.created_at)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Güncellenme Tarihi:</Text>
        <Text style={styles.value}>{formatDate(employee.updated_at)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f7a33c', 
    padding: 18,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#1e293b',
    fontSize: 14,
    marginRight: 10,
  },
  value: {
    color: '#475569',
    fontSize: 14,
    textAlign: 'right',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },
});