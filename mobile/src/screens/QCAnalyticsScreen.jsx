import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Modal,
    Dimensions
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';

const screenWidth = Dimensions.get('window').width - 32;

export default function QCAnalyticsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [weldersList, setWeldersList] = useState([]);
    const [certificatesData, setCertificatesData] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalItems, setModalItems] = useState([]);
    const [modalThemeColor, setModalThemeColor] = useState('#dc2626');

    const fetchQCAnalyticsData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const weldersRes = await apiClient.get('/quality_control.php?action=get_welders');
            const fetchedWelders = Array.isArray(weldersRes.data) ? weldersRes.data : (weldersRes.data?.data || []);
            setWeldersList(fetchedWelders);

            if (fetchedWelders.length > 0) {
                const certPromises = fetchedWelders.map(emp => {
                    const empId = emp.id;
                    const fullName = `${emp.first_name} ${emp.last_name}`.trim();

                    return apiClient.get(`/quality_control.php?action=list&employee_id=${empId}`)
                        .then(res => {
                            const list = Array.isArray(res.data) ? res.data : [];
                            return list.map(cert => ({
                                ...cert,
                                employee_name: fullName
                            }));
                        })
                        .catch(() => []);
                });

                const allCertsResults = await Promise.all(certPromises);
                setCertificatesData(allCertsResults.flat());
            }
        } catch (err) {
            console.error("KK Analiz Veri Çekme Hatası:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchQCAnalyticsData(false);
    }, [fetchQCAnalyticsData]);

    const onRefresh = () => fetchQCAnalyticsData(true);

    const maleCount = weldersList.filter(e =>
        (e.gender || e.Cinsiyet || '').toLowerCase().startsWith('e')
    ).length;

    const femaleCount = weldersList.filter(e =>
        (e.gender || e.Cinsiyet || '').toLowerCase().startsWith('k')
    ).length;

    const hasGenderData = maleCount > 0 || femaleCount > 0;
    const genderData = [
        { name: 'Erkek', population: hasGenderData ? maleCount : 0, color: '#82b2df', legendFontColor: '#2d3748', legendFontSize: 13 },
        { name: 'Kadın', population: hasGenderData ? femaleCount : 0, color: '#ef92bf', legendFontColor: '#2d3748', legendFontSize: 13 }
    ];

    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const activeCertificates = certificatesData.filter(c => {
        const isStatusActive = String(c.status || c.Durum || '').toLowerCase() === 'aktif';
        const notExpired = !c.expiry_date || new Date(c.expiry_date) >= today;
        return isStatusActive && notExpired;
    });

    const expiredCertificates = certificatesData.filter(c => {
        const isStatusPassive = String(c.status || c.Durum || '').toLowerCase() === 'pasif';
        const isExpired = c.expiry_date && new Date(c.expiry_date) < today;
        return isStatusPassive || isExpired;
    });

    const upcomingCertificates = certificatesData.filter(c => {
        if (!c.expiry_date) return false;
        const expDate = new Date(c.expiry_date);
        const isStatusActive = String(c.status).toLowerCase() === 'aktif';
        return isStatusActive && expDate >= today && expDate <= thirtyDaysLater;
    });

    const openModalList = (title, items, themeColor = '#dc2626') => {
        setModalTitle(title);
        setModalItems(items);
        setModalThemeColor(themeColor);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#76399c" />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#76399c']} />
                }
            >
                <Header
                    title="Kalite Kontrol Analitiği"
                    backgroundColor="#76399c"
                    backButtonText="Geri Dön"
                    onBackPress={() => navigation.goBack()}
                />
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#76399c" />
                        <Text style={styles.loadingText}>Yükleniyor...</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Genel Durum Özetleri</Text>

                        <View style={styles.kpiGrid}>

                            <TouchableOpacity
                                style={[styles.kpiCard, { borderLeftColor: '#28a745' }]}
                                activeOpacity={0.8}
                                onPress={() => openModalList('Aktif Sertifikalar', activeCertificates, '#28a745')}
                            >
                                <Text style={styles.kpiValue}>{activeCertificates.length}</Text>
                                <Text style={styles.kpiLabel}>Aktif Sertifika</Text>
                            </TouchableOpacity>

                            <View style={[styles.kpiCard, { borderLeftColor: '#76399c' }]}>
                                <Text style={styles.kpiValue}>{weldersList.length}</Text>
                                <Text style={styles.kpiLabel}>Toplam Kaynakçı</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.kpiCard, { borderLeftColor: '#d97706' }]}
                                activeOpacity={0.8}
                                onPress={() => openModalList('30 Gün İçinde Süresi Dolacak Sertifikalar', upcomingCertificates, '#d97706')}
                            >
                                <View style={styles.badgeOrange}>
                                    <Text style={styles.badgeTextOrange}>30 Gün İçinde Süresi Dolacak</Text>
                                </View>
                                <Text style={[styles.kpiValue, { color: '#b45309' }]}>{upcomingCertificates.length}</Text>
                                <Text style={styles.kpiLabel}>Yaklaşan Sertifika</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.kpiCard, { borderLeftColor: '#dc2626' }]}
                                activeOpacity={0.8}
                                onPress={() => openModalList('Süresi Dolmuş Sertifikalar', expiredCertificates, '#dc2626')}
                            >
                                <View style={styles.badgeRed}>
                                    <Text style={styles.badgeTextRed}>Süresi Doldu</Text>
                                </View>
                                <Text style={[styles.kpiValue, { color: '#dc2626' }]}>{expiredCertificates.length}</Text>
                                <Text style={styles.kpiLabel}>Pasif Sertifikalar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.chartCard}>
                            <Text style={styles.chartTitle}>Cinsiyete Göre Dağılım</Text>
                            <PieChart
                                data={genderData}
                                width={screenWidth - 40}
                                height={160}
                                chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[0, 0]}
                                absolute
                            />

                        </View>
                    </>
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: modalThemeColor }]}>{modalTitle}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCloseText}>Kapat</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                            {modalItems.length === 0 ? (
                                <Text style={styles.emptyText}>Kayıtlı veri bulunamadı.</Text>
                            ) : (
                                modalItems.map((item, index) => (
                                    <View key={index} style={[styles.modalCard, { borderLeftColor: modalThemeColor }]}>
                                        <Text style={styles.modalCertTitle}>
                                            {item.certificate_name}
                                        </Text>
                                        <Text style={styles.modalPersonText}>
                                            Personel: <Text style={styles.modalPersonName}>{item.employee_name}</Text>
                                        </Text>
                                        <Text style={[styles.modalExpiryText, { color: modalThemeColor }]}>
                                            Bitiş Tarihi: {item.expiry_date}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#76399c'
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40
    },
    loadingContainer: {
        paddingVertical: 60,
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 12,
        color: '#76399c',
        fontSize: 14,
        fontWeight: '500'
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 14
    },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16
    },
    kpiCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        minHeight: 90,
        justifyContent: 'center'
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827'
    },
    kpiLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        marginTop: 2
    },
    chartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2
    },
    chartTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 8
    },
    genderStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    genderBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontWeight: 'bold',
        fontSize: 12
    },
    badgeOrange: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 4
    },
    badgeTextOrange: {
        color: '#b45309',
        fontSize: 9,
        fontWeight: 'bold'
    },
    badgeRed: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 4
    },
    badgeTextRed: {
        color: '#dc2626',
        fontSize: 9,
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justify: 'flex-end'
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        padding: 20
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalCloseText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6b7280'
    },
    modalList: {
        marginTop: 4
    },
    modalCard: {
        backgroundColor: '#f9fafb',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4
    },
    modalCertTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4
    },
    modalPersonText: {
        fontSize: 13,
        color: '#6b7280'
    },
    modalPersonName: {
        fontWeight: 'bold',
        color: '#374151'
    },
    modalExpiryText: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 4
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        paddingVertical: 20,
        fontSize: 14
    }
});