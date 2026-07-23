import React, { useState, useEffect } from 'react';
import { Modal,  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../atoms/Button';

export default function SendNotificationModal({ 
  isOpen, 
  onClose, 
  employeeName, 
  certificateName, 
  onSend 
}) {
  const templates = [
    `${certificateName || 'Belgenizin'} geçerlilik süreniz dolmak üzeredir. Lütfen en kısa sürede birime uğrayarak yenileme işlemlerini tamamlayınız.`,
    `Sistemde kayıtlı olan ${certificateName || 'belgenizin'} süresi yaklaşmıştır. Güncel evraklarınızı teslim etmeniz gerekmektedir.`,
    `Periyodik kontrolleriniz kapsamında ilgili birime gelerek evrak/test işlemlerinizi tekrarlamanız rica olunur.`
  ];

  const [message, setMessage] = useState(templates[0]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  useEffect(() => {
    setMessage(templates[selectedTemplateIndex]);
  }, [certificateName, selectedTemplateIndex]);

  if (!isOpen) return null;

  const handleSelectTemplate = (index) => {
    setSelectedTemplateIndex(index);
    setMessage(templates[index]);
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            Bildirim Gönder: {employeeName}
          </Text>

          <Text style={styles.certificateSubtitle}>
            <Text style={styles.boldLabel}>Belge: </Text>
            {certificateName}
          </Text>

          <Text style={styles.fieldLabel}>Hazır Şablon Seçin:</Text>
          <View style={styles.templateContainer}>
            {templates.map((_, index) => {
              const isSelected = selectedTemplateIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => handleSelectTemplate(index)}
                  style={[
                    styles.templateChip,
                    isSelected ? styles.selectedChip : styles.unselectedChip
                  ]}
                >
                  <Text style={[
                    styles.chipText,
                    isSelected ? styles.selectedChipText : styles.unselectedChipText
                  ]}>
                    Şablon {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Mesaj İçeriği:</Text>
          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text)}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textarea}
          />

          <View style={styles.buttonRow}>
            <Button 
              onPress={onClose} 
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            >
              İptal
            </Button>
            
            <Button 
              onPress={() => onSend && onSend(message)} 
              style={styles.sendButton}
              textStyle={styles.sendButtonText}
            >
              Bildirimi Gönder
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#3182ce',
    paddingBottom: 8,
    marginBottom: 10,
  },
  certificateSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 15,
  },
  boldLabel: {
    fontWeight: 'bold',
    color: '#4a5568',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 6,
  },
  templateContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  templateChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: '#ebf8ff',
    borderColor: '#3182ce',
  },
  unselectedChip: {
    backgroundColor: '#f7fafc',
    borderColor: '#cbd5e0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#2b6cb0',
  },
  unselectedChipText: {
    color: '#4a5568',
  },
  textarea: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#2d3748',
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#718096',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});