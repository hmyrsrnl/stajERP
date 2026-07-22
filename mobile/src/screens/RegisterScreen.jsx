import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import RegisterForm from '../components/organisms/RegisterForm';
import apiClient from '../api/client';

export default function RegisterScreen({ navigation }) {
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (registerData) => {
        setErrorMessage('');
        try {
            const res = await apiClient.post('/register.php', registerData);

            if (res.data && (res.data.status === 'success' || res.data.message)) {
                Alert.alert(
                    "Başarılı",
                    "Kayıt başarıyla gerçekleşti! Giriş ekranına yönlendiriliyorsunuz.",
                    [
                        {
                            text: "Tamam",
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            } else {
                setErrorMessage(res.data.error || 'Kayıt işlemi başarısız oldu.');
            }
        } catch (err) {
            console.error("Kayıt hatası:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMessage(err.response.data.error);
            } else {
                setErrorMessage("Kayıt yapılırken bir hata oluştu veya sunucuya erişilemedi.");
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>PERSONEL KAYIT PANELİ</Text>

                        <RegisterForm
                            onSubmit={handleRegister}
                            errorMessage={errorMessage}
                        />

                        <Text style={styles.footerText}>
                            Zaten hesabınız var mı?{' '}
                            <Text
                                onPress={() => navigation.navigate('Login')}
                                style={styles.loginLink}
                            >
                                Giriş Yap
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    cardContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f472e9',
        marginBottom: 20,
        textAlign: 'center',
    },
    footerText: {
        marginTop: 15,
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
    },
    loginLink: {
        color: '#f472e9',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});