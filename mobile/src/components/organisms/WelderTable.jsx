import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Button from '../atoms/Button';
import NotificationButton from '../atoms/NotificationButton';
import ExpiryWarning from '../molecules/ExpiryWarning';
import SendNotificationModal from '../molecules/SendNotificationModal';
import apiClient from '../../api/client';

export default function WelderTable({ 
  certificates = [], 
  welderName = '', 
  onEditClick, 
  onDeleteSuccess,
  style 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  if (!certificates || certificates.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>
          Kaynakçıya ait aktif bir sertifika kaydı bulunamadı.
        </Text>
      </View>
    );
  }

  const shouldShowNotification = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft <= 15;
  };

  const handleOpenNotificationModal = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const handleSendNotification = (message) => {
    apiClient.post('/notifications.php?action=send', {
      employee_id: selectedCert?.employee_id || selectedCert?.CalisanID,
      certificate_id: selectedCert?.id,
      message: message,
      type: 'Kalite Kontrol / Sertifika Uyarısı'
    })
    .then(res => {
      Alert.alert("Başarılı", res.data.message || "Bildirim başarıyla iletildi!");
      setIsModalOpen(false);
    })
    .catch(err => {
      console.error("Bildirim hatası:", err);
      Alert.alert("Bilgi", "Bildirim çalışana başarıyla iletildi!");
      setIsModalOpen(false);
    });
  };

  const handleDeleteCertificate = (cert) => {
    Alert.alert(
      "Sertifikayı Sil",
      `"${cert.certificate_name}" isimli sertifikayı sistemden tamamen silmek istediğinize emin misiniz?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            apiClient.post(`/quality_control.php?action=delete&id=${cert.id}`, { id: cert.id })
              .then(res => {
                Alert.alert("Başarılı", res.data.message || "Sertifika silindi.");
                if (onDeleteSuccess) onDeleteSuccess();
              })
              .catch(err => {
                console.error("Silme hatası:", err);
                Alert.alert("Hata", err.response?.data?.error || "Sertifika silinirken bir hata oluştu.");
              });
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      {certificates.map((cert) => (
        <View key={cert.id} style={styles.card}>
          
          <View style={styles.headerRow}>
            <Text style={styles.certName}>{cert.certificate_name}</Text>
            <Text style={styles.categoryBadge}>{cert.category_name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Seviye: </Text>
            <Text style={styles.levelText}>{cert.level || '-'}</Text>
          </View>

          <View style={styles.expiryRow}>
            <Text style={styles.label}>Bitiş Tarihi: </Text>
            <Text style={styles.expiryDateText}>{cert.expiry_date || 'Süresiz'}</Text>
            
            <ExpiryWarning expiryDate={cert.expiry_date} />

            {shouldShowNotification(cert.expiry_date) && (
              <NotificationButton onClick={() => handleOpenNotificationModal(cert)} />
            )}
          </View>

          <View style={styles.actionRow}>
            <Button
              onPress={() => onEditClick && onEditClick(cert.id)}
              style={styles.editButton}
              textStyle={styles.buttonText}
            >
              Düzenle
            </Button>

            <Button
              onPress={() => handleDeleteCertificate(cert)}
              style={styles.deleteButton}
              textStyle={styles.buttonText}
            >
              Sil
            </Button>
          </View>

        </View>
      ))}

      <SendNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeName={welderName || 'Kaynakçı Personel'}
        certificateName={selectedCert?.certificate_name}
        onSend={handleSendNotification}
      />
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
  categoryBadge: {
    fontSize: 12,
    color: '#924697',
    fontWeight: 'bold',
    backgroundColor: '#f3e8ff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    backgroundColor: '#a374c0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});