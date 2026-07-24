import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../atoms/Button';

export default function DepartmentRequestManager({ pendingRequests = [], onAction, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        Onay Bekleyen Çalışan Talepleri
      </Text>

      {!pendingRequests || pendingRequests.length === 0 ? (
        <Text style={styles.emptyText}>
          Şu anda onayınızı bekleyen herhangi bir talep bulunmamaktadır.
        </Text>
      ) : (
        <View style={styles.cardList}>
          {pendingRequests.map((req) => (
            <View key={req.id} style={styles.requestCard}>
              
              <View style={styles.row}>
                <Text style={styles.label}>Gönderen:</Text>
                <Text style={styles.senderName}>
                  {req.first_name} {req.last_name}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Konu:</Text>
                <Text style={styles.value}>{req.subject}</Text>
              </View>

              <View style={styles.rowColumn}>
                <Text style={styles.label}>Açıklama:</Text>
                <Text style={styles.descriptionValue}>{req.description}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Tarih:</Text>
                <Text style={styles.dateValue}>{req.created_at}</Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  onPress={() => onAction && onAction(req.id, 'Onaylandı')}
                  style={styles.approveButton}
                  textStyle={styles.buttonText}
                >
                  Onayla
                </Button>

                <Button
                  onPress={() => onAction && onAction(req.id, 'Reddedildi')}
                  style={styles.rejectButton}
                  textStyle={styles.buttonText}
                >
                  Reddet
                </Button>
              </View>

            </View>
          ))}
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
    marginTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b5876',
    borderBottomWidth: 2,
    borderBottomColor: '#2b5876',
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
    gap: 15,
  },
  requestCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowColumn: {
    flexDirection: 'column',
    gap: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#495057',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#212529',
  },
  value: {
    fontSize: 13,
    color: '#212529',
    flexShrink: 1,
  },
  descriptionValue: {
    fontSize: 13,
    color: '#343a40',
    marginTop: 2,
    lineHeight: 18,
  },
  dateValue: {
    fontSize: 12,
    color: '#6c757d',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  approveButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  rejectButton: {
    backgroundColor: '#c62828',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});