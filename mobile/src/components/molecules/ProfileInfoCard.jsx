import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileInfoCard({ employeeInfo }) {
    if (!employeeInfo) return null;

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Profil Bilgilerim</Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>Ad Soyad: </Text>
                <Text style={styles.value}>{employeeInfo.first_name} {employeeInfo.last_name}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>E-posta: </Text>
                <Text style={styles.value}>{employeeInfo.email}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>Görev / Unvan: </Text>
                <Text style={styles.value}>{employeeInfo.role_name}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>Telefon Numarası: </Text>
                <Text style={styles.value}>{employeeInfo.phone_number}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>Adres: </Text>
                <Text style={styles.value}>{employeeInfo.home_address}</Text>
            </Text>

            <View style={styles.statusContainer}>
                <Text style={styles.label}>İş Durumu: </Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {employeeInfo.status || 'Aktif'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        width: '100%',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2b5876',
        borderBottomWidth: 2,
        borderBottomColor: '#2b5876',
        paddingBottom: 8,
        marginBottom: 15,
    },
    infoRow: {
        marginVertical: 6,
        fontSize: 14,
        color: '#333333',
    },
    label: {
        fontWeight: 'bold',
        color: '#212529',
    },
    value: {
        color: '#495057',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    badge: {
        backgroundColor: '#e8f5e9',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginLeft: 6,
    },
    badgeText: {
        color: '#2e7d32',
        fontSize: 12,
        fontWeight: 'bold',
    },
});