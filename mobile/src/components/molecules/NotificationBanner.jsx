import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../atoms/Button';
import NotificationBadge from '../atoms/NotificationBadge'; 

export default function NotificationBanner({ notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);

  if (!notifications || notifications.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bannerBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.bannerTitle}>Yeni Bildiriminiz Var!</Text>
          {NotificationBadge ? (
            <NotificationBadge count={notifications.length} />
          ) : (
            <View style={styles.badgeFallback}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </View>

        <Button 
          onPress={() => setShowNotifications(!showNotifications)}
          style={styles.toggleButton}
          textStyle={styles.toggleButtonText}
        >
          {showNotifications ? 'Gizle' : 'Bildirimleri Oku'}
        </Button>
      </View>

      {showNotifications && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownHeader}>
            Gelen Bildirim Kutusu
          </Text>

          <ScrollView style={styles.scrollList} nestedScrollEnabled={true}>
            {notifications.map((note, index) => (
              <View key={note.id || index} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteType}>
                    {note.type || 'Sistem Uyarısı'}
                  </Text>
                  <Text style={styles.noteDate}>
                    {note.created_at}
                  </Text>
                </View>
                <Text style={styles.noteMessage}>
                  {note.message}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
  },
  bannerBar: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeeba',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    color: '#856404',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleButton: {
    backgroundColor: '#d39e00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#b8daff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dropdownHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004085',
    borderBottomWidth: 1,
    borderBottomColor: '#b8daff',
    paddingBottom: 6,
    marginBottom: 10,
  },
  scrollList: {
    maxHeight: 200, 
  },
  noteCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginBottom: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noteType: {
    fontWeight: 'bold',
    color: '#0056b3',
    fontSize: 12,
  },
  noteDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  noteMessage: {
    fontSize: 14,
    color: '#333333',
  },
  badgeFallback: {
    backgroundColor: '#e63946',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});