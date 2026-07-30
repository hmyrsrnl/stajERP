import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ExpiryWarning from '../molecules/ExpiryWarning';

export default function WelderTable({ 
  certificates = [], 
  style 
}) {
  if (!certificates || certificates.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>
          Kaynakçıya ait aktif bir sertifika kaydı bulunamadı.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {certificates.map((cert) => {
        const rawStatus = cert.status;
        const isPassive = String(rawStatus).toLowerCase() === 'pasif';
        const statusText = isPassive ? 'Pasif' : 'Aktif';

        return (
          <View key={cert.id || cert.ID} style={styles.card}>
            
            <View style={styles.headerRow}>
              <Text style={styles.certName}>{cert.certificate_name }</Text>

              <View style={[
                styles.statusBadge, 
                isPassive ? styles.passiveBadge : styles.activeBadge
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  isPassive ? styles.passiveText : styles.activeText
                ]}>
                  {statusText}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Seviye: </Text>
              <Text style={styles.levelText}>{cert.level}</Text>
            </View>

            <View style={styles.expiryRow}>
              <Text style={styles.label}>Bitiş Tarihi: </Text>
              <Text style={styles.expiryDateText}>{cert.expiry_date}</Text>
              
              <ExpiryWarning expiryDate={cert.expiry_date} />
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
  },
  emptyContainer: {
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777777',
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
    marginBottom: 4,
  },
  certName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
    paddingRight: 8,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeBadge: {
    backgroundColor: '#c6f6d5',
  },
  passiveBadge: {
    backgroundColor: '#fed7d7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#22543d',
  },
  passiveText: {
    color: '#9b2c2c',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#495057',
  },
  levelText: {
    fontSize: 13,
    color: '#e65100',
    fontWeight: '500',
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  expiryDateText: {
    fontSize: 13,
    color: '#212529',
  },
});