import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeeCertificateTable({ certificates = [], style }) {
  const getStatusBadgeStyle = (status) => {
    return status === 'Aktif'
      ? { backgroundColor: '#e8f5e9', color: '#2e7d32' }
      : { backgroundColor: '#ffebee', color: '#c62828' };
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        Mevcut Sertifikalarım ve Yeterliliklerim
      </Text>

      {!certificates || certificates.length === 0 ? (
        <Text style={styles.emptyText}>
          Sisteme kayıtlı aktif bir sertifikanız bulunmamaktadır.
        </Text>
      ) : (
        <View style={styles.cardList}>
          {certificates.map((cert) => {
            const statusStyle = getStatusBadgeStyle(cert.status);

            return (
              <View key={cert.id} style={styles.certCard}>
                
                <View style={styles.headerRow}>
                  <Text style={styles.certName}>{cert.certificate_name}</Text>
                  <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[styles.badgeText, { color: statusStyle.color }]}>
                      {cert.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Kategori: </Text>
                  <Text style={styles.value}>{cert.category_name}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Seviye / Yeterlilik: </Text>
                  <Text style={styles.value}>{cert.level || '-'}</Text>
                </View>

                <View style={styles.datesContainer}>
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>Veriliş Tarihi</Text>
                    <Text style={styles.dateValue}>{cert.issue_date}</Text>
                  </View>

                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>Geçerlilik Bitiş</Text>
                    <Text style={styles.dateValue}>{cert.expiry_date}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    textAlign: 'left',
    marginBottom: 15,
  },
  emptyText: {
    color: '#777777',
    fontStyle: 'italic',
    textAlign: 'left',
    paddingVertical: 10,
    fontSize: 14,
  },
  cardList: {
    gap: 12,
  },
  certCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  certName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
    paddingRight: 8,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#495057',
  },
  value: {
    fontSize: 13,
    color: '#212529',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  dateCol: {
    flexDirection: 'column',
  },
  dateLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 13,
    color: '#212529',
    marginTop: 2,
  },
});