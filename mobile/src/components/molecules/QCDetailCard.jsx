import React from "react";
import { View, Text, StyleSheet } from 'react-native';

export default function QCDetailCard({ welder, style }) {
    if (!welder) return null;

    return (
        <View style={[style.cardContainer, style]}>
            <Text style={styles.infoRow}>
                <Text style={styles.label}>Ad Soyad: </Text>
                <Text style={styles.value}>{employee.first_name} {employee.last_name}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>T.C. No: </Text>
                <Text style={styles.value}>{employee.tc_no}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>Görev: </Text>
                <Text style={styles.value}>{employee.role_name}</Text>
            </Text>

            <Text style={styles.infoRow}>
                <Text style={styles.label}>Durum: </Text>
                <Text style={styles.statusText}>{employee.status || 'Aktif'}</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#6a1b9a',
        padding: 20,
        borderRadius: 8,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 15,
    },
    infoRow: {
        marginVertical: 5,
        fontSize: 14,
        color: '#333333',
    },
    label: {
        fontWeight: 'bold',
        color: '#1e293b',
    },
    value: {
        color: '#475569',
    },
    statusText: {
        color: 'green',
        fontWeight: 'bold',
    },
});