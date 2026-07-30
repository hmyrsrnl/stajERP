import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import QCDetailCard from '../components/molecules/QCDetailCard';
import WelderTable from '../components/organisms/WelderTable';

export default function QCEmployeeDetailScreen({ route, navigation }) {
    const { id } = route.params || {};

    const [weldInfo, setWeldInfo] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCertificates = async () => {
        try {
            const res = await apiClient.get(`/quality_control.php?action=list&employee_id=${id}`);
            const certs = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setCertificates(certs);
        } catch (err) {
            console.error("Sertifikalar yüklenirken hata oluştu:", err);
            setCertificates([]);
        }
    };

    const fetchWeldInfo = async () => {
        try {
            const res = await apiClient.get(`/employee_detail.php?id=${id}`);
            const info = res.data?.data || res.data;
            setWeldInfo(info);
        } catch (err) {
            console.error("Kaynakçı bilgileri yüklenemedi:", err);
            setWeldInfo(null);
        }
    };

    const loadScreenData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        await Promise.all([fetchWeldInfo(), fetchCertificates()]);

        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        if (id) {
            loadScreenData(false);
        }
    }, [id]);

    const onRefresh = () => {
        loadScreenData(true);
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#76399c" />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    if (!weldInfo) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Kaynakçı bilgisi bulunamadı.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Geri Dön</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const welderFullName = `${weldInfo.first_name } ${weldInfo.last_name }`.trim();

    return (
        <View style={styles.container}>


            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#76399c']} />
                }
            >
                <Header
                    title="Kaynakçı Sertifikasyon Dosyası"
                    backgroundColor="#76399c"
                    backButtonText="Geri Dön"
                    onBackPress={() => navigation.goBack()}
                />
                <QCDetailCard welder={weldInfo} />


                <View style={styles.tableCard}>
                    <WelderTable
                        certificates={certificates}
                        welderName={welderFullName}
                        onEditClick={(certId) => navigation.navigate('QCEditCertificate', { certId, employeeId: id })}
                        onDeleteSuccess={fetchCertificates}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        paddingVertical: 60,
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#76399c',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 16,
    },
    backBtn: {
        backgroundColor: '#76399c',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    addCertBtn: {
        backgroundColor: '#a374c0',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    addCertBtnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    tableCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
});