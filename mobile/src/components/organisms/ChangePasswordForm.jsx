import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../atoms/Button';
import apiClient from '../../api/client';

export default function ChangePasswordForm({ employeeId, style }) {
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    setMessage('');
    setError('');

    if (!passwords.old_password || !passwords.new_password || !passwords.confirm_password) {
      setError("Lütfen tüm alanları doldurunuz!");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      setError("Yeni şifreler uyuşmuyor!");
      return;
    }

    apiClient.post('/change_password.php', {
      employee_id: employeeId,
      old_password: passwords.old_password,
      new_password: passwords.new_password
    })
      .then(res => {
        setMessage(res.data.message || "Şifreniz başarıyla güncellendi.");
        setPasswords({ old_password: '', new_password: '', confirm_password: '' });
      })
      .catch(err => {
        setError(err.response?.data?.error || "Şifre güncellenirken bir hata oluştu.");
      });
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <Text style={styles.title}>Şifre Değiştir</Text>

      {message ? <Text style={styles.successMessage}>{message}</Text> : null}
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mevcut Şifre</Text>
        <TextInput
          secureTextEntry={true}
          value={passwords.old_password}
          onChangeText={value => handleChange('old_password', value)}
          placeholder="Mevcut şifrenizi giriniz"
          placeholderTextColor="#a0aec0"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Yeni Şifre</Text>
        <TextInput
          secureTextEntry={true}
          value={passwords.new_password}
          onChangeText={value => handleChange('new_password', value)}
          placeholder="Yeni şifrenizi giriniz"
          placeholderTextColor="#a0aec0"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroupLarge}>
        <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
        <TextInput
          secureTextEntry={true}
          value={passwords.confirm_password}
          onChangeText={value => handleChange('confirm_password', value)}
          placeholder="Yeni şifrenizi tekrar giriniz"
          placeholderTextColor="#a0aec0"
          style={styles.input}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          onPress={handlePasswordSubmit}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        >
          Şifreyi Güncelle
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2b5876',
    paddingBottom: 8,
  },
  successMessage: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 14,
  },
  errorMessage: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputGroupLarge: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
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
  buttonWrapper: {
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#2b5876',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});