import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormTextarea from '../molecules/FormTextarea';
import Button from '../atoms/Button';

export default function RequestForm({ onSubmit, departments = [], style }) {
  const [departmentId, setDepartmentId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = () => {
    if (!departmentId) {
      Alert.alert("Uyarı", "Lütfen bir departman seçiniz!");
      return;
    }

    if (!subject.trim() || !description.trim()) {
      Alert.alert("Uyarı", "Lütfen konu ve açıklama alanlarını doldurunuz!");
      return;
    }

    if (onSubmit) {
      onSubmit({ departmentId, subject, description });
    }

    setDepartmentId('');
    setSubject('');
    setDescription('');
  };

  return (
    <ScrollView 
      style={[styles.formContainer, style]} 
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Yeni Talep Oluştur</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>İlgili Departman</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={departmentId}
            onValueChange={(itemValue) => setDepartmentId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="-- Departman Seçiniz --" value="" color="#888" />
            {departments.map((dept) => (
              <Picker.Item 
                key={dept.id} 
                label={dept.department_name} 
                value={dept.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Konu</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={(text) => setSubject(text)}
          placeholder="Örn: Yıllık İzin Talebi, Muayene Randevusu vb."
          placeholderTextColor="#a0aec0"
        />
      </View>

      <View style={styles.textareaGroup}>
        <FormTextarea
          label="Talep Açıklaması"
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Talebinizin detaylarını buraya yazınız..."
          rows={4}
        />
      </View>

      <Button
        onPress={handleFormSubmit}
        style={styles.submitButton}
        textStyle={styles.submitButtonText}
      >
        Gönder
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b5876',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingBottom: 8,
    marginBottom: 15,
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: 15,
  },
  textareaGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
    color: '#333333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333333',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    color: '#2d3748',
    backgroundColor: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#2b5876',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});