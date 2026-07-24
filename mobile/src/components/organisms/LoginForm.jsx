import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

export default function LoginForm({ onSubmit, errorMessage, onNavigateRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onSubmit({ email, password });
    };

    return (
        <View style={styles.formContainer}>
            {errorMessage ? (
                <Text style={styles.errorText}>
                    {errorMessage}
                </Text>
            ) : null}

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
                Giriş Yap
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
    footerText: {
        marginTop: 15,
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
    },
    registerLink: {
        color: '#f472e9',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});