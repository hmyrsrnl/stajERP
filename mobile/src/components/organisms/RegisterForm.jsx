import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

export default function RegisterForm({ onSubmit, errorMessage }) {
  const [tc_no, setTcNo] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        tc_no,
        first_name,
        last_name,
        email,
        password,
        phone_number,
      });
    }
  };

  return (
    <View style={styles.formContainer}>
      {errorMessage ? (
        <Text style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}

      <FormField
        label="T.C. Kimlik No"
        keyboardType="numeric"
        value={tc_no}
        onChangeText={setTcNo}
        placeholder="T.C. Kimlik Numaranız" 
      />

      <FormField
        label="Ad"
        value={first_name}
        onChangeText={setFirstName}
        placeholder="Adınız" 
      />

      <FormField
        label="Soyad"
        value={last_name}
        onChangeText={setLastName}
        placeholder="Soyadınız" 
      />

      <FormField
        label="Telefon Numarası"
        keyboardType="phone-pad"
        value={phone_number}
        onChangeText={setPhoneNumber}
        placeholder="05xx xxx xx xx" 
      />

      <FormField
        label="E-posta"
        type="email"
        value={email}
        onChangeText={setEmail}
        placeholder="ornek@firma.com" 
      />

      <FormField
        label="Şifre"
        type="password"
        value={password}
        onChangeText={setPassword}
        placeholder="******" 
      />

      <Button 
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Kayıt Ol
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#ef4ee1',
    width: '100%',
    marginTop: 10,
  },
});