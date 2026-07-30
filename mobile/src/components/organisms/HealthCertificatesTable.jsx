import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ExpiryWarning from '../molecules/ExpiryWarning';

export default function HealthCertificatesTable({ 
  certificates = [], 
  isReadOnly = true, 
  style 
}) {
  if (!certificates || certificates.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>
          Bu çalışana ait yüklenmiş bir sağlık raporu veya sertifikası bulunamadı.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {certificates.map(cert => {
        const expiryDateStr = cert.expiry_date;
        const dbStatus = cert.status;

        let isExpired = false;
        if (expiryDateStr) {
          const today = new Date();
          const expiryDate = new Date(expiryDateStr);
          if (expiryDate.toString() !== 'Invalid Date' && today > expiryDate) {
            isExpired = true;
          }
        }

        const isPassive = isExpired || String(dbStatus).toLowerCase() === 'pasif';
        const displayStatus = isPassive ? 'Pasif' : (dbStatus || 'Aktif');

        return (
          <View key={cert.id || cert.ID} style={styles.card}>
            
            <View style={styles.headerRow}>
              <Text style={styles.certName}>{cert.certificate_name}</Text>
              
              <Text style={[
                styles.statusBadge, 
                { 
                  backgroundColor: isPassive ? '#fed7d7' : '#c6f6d5',
                  color: isPassive ? '#9b2c2c' : '#22543d'
                }
              ]}>
                {displayStatus}
              </Text>
            </View>

            <View style={styles.datesContainer}>
              <View style={styles.dateCol}>
                <Text style={styles.dateLabel}>Veriliş Tarihi</Text>
                <Text style={styles.dateValue}>{cert.issue_date || '-'}</Text>
              </View>

              <View style={styles.dateCol}>
                <Text style={styles.dateLabel}>Geçerlilik Tarihi</Text>
                <View style={styles.expiryValueRow}>
                  <Text style={styles.expiryDateText}>
                    {cert.expiry_date || 'Süresiz'}
                  </Text>
                  <ExpiryWarning expiryDate={cert.expiry_date} />
                </View>
              </View>
            </View>

          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    gap: 12, 
    marginTop: 8 
  },
  emptyContainer: { 
    padding: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emptyText: { 
    color: '#777777', 
    fontStyle: 'italic',
    textAlign: 'center', 
    fontSize: 13 
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 10,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 6,
  },
  certName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004d40',
    flex: 1,
    paddingRight: 8,
  },
  statusBadge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  datesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  dateCol: { 
    flex: 1 
  },
  dateLabel: { 
    fontSize: 11, 
    color: '#6c757d', 
    fontWeight: '600', 
    marginBottom: 2 
  },
  dateValue: { 
    fontSize: 13, 
    color: '#212529' 
  },
  expiryValueRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    flexWrap: 'wrap' 
  },
  expiryDateText: { 
    fontSize: 13, 
    color: '#d32f2f', 
    fontWeight: '500' },
});