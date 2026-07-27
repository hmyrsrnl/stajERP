import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../atoms/Button';
import NotificationButton from '../atoms/NotificationButton';
import ExpiryWarning from '../molecules/ExpiryWarning';

export default function HealthCertificatesTable({ 
  certificates = [], 
  onEdit, 
  onDelete, 
  onOpenNotification,
  style 
}) {
  const shouldShowNotification = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft <= 15;
  };

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
      {certificates.map(cert => (
        <View key={cert.id} style={styles.card}>
          
          <Text style={styles.certName}>{cert.certificate_name}</Text>

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
                
                {shouldShowNotification(cert.expiry_date) && (
                  <NotificationButton onClick={() => onOpenNotification && onOpenNotification(cert)} />
                )}
              </View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button
              onPress={() => onEdit && onEdit(cert.id)}
              style={styles.editButton}
              textStyle={styles.buttonText}
            >
              Düzenle
            </Button>
            <Button
              onPress={() => onDelete && onDelete(cert)}
              style={styles.deleteButton}
              textStyle={styles.buttonText}
            >
              Sil
            </Button>
          </View>

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777777',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  certName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004d40',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 6,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    color: '#212529',
  },
  expiryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  expiryDateText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    backgroundColor: '#12a48c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});