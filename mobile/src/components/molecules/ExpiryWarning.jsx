import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function ExpiryWarning({ expiryDate, style }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!expiryDate) return null;

  const today = new Date();
  const expiry = new Date(expiryDate);

  const timeDiff = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let iconColor = '#f57c00';
  let shouldWarn = false;
  let isExpired = false;

  if (daysLeft < 0) {
    shouldWarn = true;
    isExpired = true;
    iconColor = '#d32f2f'; 
  } else if (daysLeft <= 15) {
    shouldWarn = true;
    isExpired = false;
    iconColor = '#f57c00'; 
  }

  if (!shouldWarn) return null;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowTooltip(!showTooltip)}
        style={[
          styles.iconBadge, 
          { borderColor: iconColor, backgroundColor: `${iconColor}20` }
        ]}
      >
        <Text style={[styles.iconText, { color: iconColor }]}>!</Text>
      </TouchableOpacity>

      {showTooltip && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showTooltip}
          onRequestClose={() => setShowTooltip(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowTooltip(false)}
          >
            <View style={styles.tooltipBox}>
              <Text style={styles.tooltipText}>
                Dikkat! {isExpired ? (
                  <>
                    Bu belgenin geçerlilik süresi{' '}
                    <Text style={styles.expiredHighlight}>
                      {Math.abs(daysLeft)} gün önce
                    </Text>{' '}
                    dolmuş!
                  </>
                ) : (
                  <>
                    Belgenin geçerlilik tarihine sadece{' '}
                    <Text style={styles.warningHighlight}>
                      {daysLeft} gün
                    </Text>{' '}
                    kaldı.
                  </>
                )}
              </Text>
              <Text style={styles.closeHint}>Kapatmak için dokunun</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  iconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipBox: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 16,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  expiredHighlight: {
    color: '#ff8a80',
    fontWeight: 'bold',
  },
  warningHighlight: {
    color: '#ffd54f',
    fontWeight: 'bold',
  },
  closeHint: {
    marginTop: 12,
    fontSize: 11,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
});