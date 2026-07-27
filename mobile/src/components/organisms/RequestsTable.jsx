import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RequestTable({ requests = [], style }) {

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Onaylandı':
        return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'Reddedildi':
        return { bg: '#ffebee', color: '#c62828' };
      default:
        return { bg: '#fff9c4', text: '#f57f17' }; // Beklemede / Varsayılan
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Gönderdiğim Talepler</Text>

      {!requests || requests.length === 0 ? (
        <Text style={styles.emptyText}>Henüz bir talebiniz bulunmuyor.</Text>
      ) : (
        <View style={styles.listContainer}>
          {requests.map((req) => {
            const statusColors = getStatusStyle(req.status);

            return (
              <View key={req.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.departmentText}>
                    {req.department}
                  </Text>
                  
                  <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
                    <Text style={[styles.badgeText, { color: statusColors.text }]}>
                      {req.status}
                    </Text>
                  </View>
                </View>

                
                <Text style={styles.subjectText}>{req.subject}</Text>

               
                <Text style={styles.dateText}>{req.created_at}</Text>
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
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 8,
    marginBottom: 15,
    textAlign: 'left',
  },
  emptyText: {
    color: '#777777',
    fontStyle: 'italic',
    paddingVertical: 10,
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2b5876',
    textTransform: 'uppercase',
    flexShrink: 1,
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
  subjectText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
});