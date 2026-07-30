import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';

const screenWidth = Dimensions.get('window').width - 32;

export default function InfirmaryAnalyticsScreen({ route, navigation }) {
    const { employeesData = [] } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [examinationsData, setExaminationsData] = useState([]);
    const [certificatesData, setCertificatesData] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllDataFromDB = useCallback(async () => {
        if (!employeesData || employeesData.length === 0) {
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            const examPromises = employeesData.map(emp => {
                const empId = emp.id || emp.ID;
                return apiClient.get(`/infirmary.php?action=list&employee_id=${empId}`)
                    .then(res => {
                        const list = Array.isArray(res.data) ? res.data : [];
                        return list.map(item => ({
                            ...item,
                            employee_name: `${emp.first_name || emp.Ad || ''} ${emp.last_name || emp.Soyad || ''}`.trim()
                        }));
                    })
                    .catch(() => []);
            });

            const certPromises = employeesData.map(emp => {
                const empId = emp.id || emp.ID;
                return apiClient.get(`/health_certificates.php?action=list&employee_id=${empId}`)
                    .then(res => {
                        const list = Array.isArray(res.data) ? res.data : [];
                        return list.map(item => ({
                            ...item,
                            employee_name: `${emp.first_name || emp.Ad || ''} ${emp.last_name || emp.Soyad || ''}`.trim()
                        }));
                    })
                    .catch(() => []);
            });

            const allExamsResults = await Promise.all(examPromises);
            const allCertsResults = await Promise.all(certPromises);

            const combinedExams = allExamsResults.flat();
            const combinedCerts = allCertsResults.flat();

            setExaminationsData(combinedExams);
            setCertificatesData(combinedCerts);

        } catch (err) {
            console.error("Analitik verileri veritabanından çekilemedi:", err);
        } finally {
            setLoading(false);
            setRefreshing(false); 
        }
    }, [employeesData]);

    useEffect(() => {
        setLoading(true);
        fetchAllDataFromDB();
    }, [fetchAllDataFromDB]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllDataFromDB();
    };

    const maleCount = employeesData.filter(e =>
        (e.gender).toLowerCase().startsWith('e')
    ).length;
    const femaleCount = employeesData.filter(e =>
        (e.gender).toLowerCase().startsWith('k')
    ).length;

    const genderData = [
        { name: 'Erkek', population: maleCount, color: '#82b2df', legendFontColor: '#2d3748', legendFontSize: 13 },
        { name: 'Kadın', population: femaleCount, color: '#ef92bf', legendFontColor: '#2d3748', legendFontSize: 13 }
    ];

    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const passiveCertificates = certificatesData.filter(c => {
        const isExpired = c.expiry_date && new Date(c.expiry_date) < today;
        const isStatusPassive = (c.status).toLowerCase() === 'pasif';
        return isExpired || isStatusPassive;
    });

    const upcomingCertificates = certificatesData.filter(c => {
        if (!c.expiry_date) return false;
        const expDate = new Date(c.expiry_date);
        const isStatusActive = (c.status).toLowerCase() !== 'pasif';
        return expDate >= today && expDate <= next30Days && isStatusActive;
    });

    const activeCertificatesCount = certificatesData.length - passiveCertificates.length;

    const diagnosisCounts = {};
    examinationsData.forEach(e => {
        const diag = e.result  || 'Diğer / Belirtilmemiş';
        diagnosisCounts[diag] = (diagnosisCounts[diag] || 0) + 1;
    });
    const sortedDiagnoses = Object.entries(diagnosisCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    const getLast7DaysHeatmap = () => {
        const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        const heatmap = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = days[d.getDay()];

            const count = examinationsData.filter(e => {
                const examDate = e.exam_date || e.MuayeneTarihi || e.created_at || '';
                return examDate.startsWith(dateStr);
            }).length;

            let color = '#ebedf0';
            if (count === 1) color = '#9be9a8';
            else if (count === 2) color = '#40c463';
            else if (count >= 3) color = '#30a14e';

            heatmap.push({ dayName, dateStr, count, color });
        }
        return heatmap;
    };

    const weeklyHeatmapData = getLast7DaysHeatmap();

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh} 
                    colors={['#00796b']} 
                    tintColor="#00796b"
                />
            }
        >
            <Header
                title="Revir Analitiği"
                backgroundColor="#00796b"
                backButtonText="Geri Dön"
                onBackPress={() => navigation.goBack()}
            />

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00796b" />
                    <Text style={styles.loadingText}>Yükleniyor...</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.sectionHeaderTitle}>Genel Durum Özetleri</Text>
                    <View style={styles.kpiGrid}>
                        <View style={[styles.kpiCard, { borderLeftColor: '#319795' }]}>
                            <Text style={styles.kpiValue}>{examinationsData.length}</Text>
                            <Text style={styles.kpiLabel}>Toplam Muayene</Text>
                        </View>

                        <View style={[styles.kpiCard, { borderLeftColor: '#38a169' }]}>
                            <Text style={styles.kpiValue}>{activeCertificatesCount}</Text>
                            <Text style={styles.kpiLabel}>Aktif Sertifika</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.kpiCard, styles.warningCard, { borderLeftColor: '#dd6b20' }]}
                            onPress={() => setActiveModal('upcoming')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.badgeAlert, { backgroundColor: '#feebc8' }]}>
                                <Text style={[styles.badgeAlertText, { color: '#c05621' }]}>30 Gün İçinde Süresi Dolacak</Text>
                            </View>
                            <Text style={[styles.kpiValue, { color: '#dd6b20' }]}>{upcomingCertificates.length}</Text>
                            <Text style={styles.kpiLabel}>Yaklaşan Sertifika</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.kpiCard, styles.alertCard, { borderLeftColor: '#e53e3e' }]}
                            onPress={() => setActiveModal('passive')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.badgeAlert, { backgroundColor: '#fed7d7' }]}>
                                <Text style={[styles.badgeAlertText, { color: '#9b2c2c' }]}>Süresi Doldu </Text>
                            </View>
                            <Text style={[styles.kpiValue, { color: '#e53e3e' }]}>{passiveCertificates.length}</Text>
                            <Text style={styles.kpiLabel}>Pasif Sertifikalar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Bu Haftanın Muayene Yoğunluğu</Text>
                        <Text style={styles.chartSubTitle}>Son 7 günde gerçekleştirilen muayene hareketliliği</Text>

                        <View style={styles.heatmapRow}>
                            {weeklyHeatmapData.map((item, index) => (
                                <View key={index} style={styles.heatmapItem}>
                                    <Text style={styles.heatmapCountText}>{item.count}</Text>
                                    <View style={[styles.heatmapSquare, { backgroundColor: item.color }]} />
                                    <Text style={styles.heatmapDayText}>{item.dayName}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>En Sık Karşılaşılan Muayene Sonuçları</Text>
                        <Text style={styles.chartSubTitle}>Muayenelerde en çok tespit edilen teşhis/sonuçlar</Text>

                        <View style={{ gap: 12, marginTop: 5 }}>
                            {sortedDiagnoses.length === 0 ? (
                                <Text style={styles.emptyText}>Veritabanında henüz kayıtlı muayene sonucu bulunmuyor.</Text>
                            ) : (
                                sortedDiagnoses.map(([diagName, count], idx) => {
                                    const maxCount = sortedDiagnoses[0][1] || 1;
                                    const percent = Math.round((count / maxCount) * 100);

                                    return (
                                        <View key={idx}>
                                            <View style={styles.diagRowHeader}>
                                                <Text style={styles.diagName}>{diagName}</Text>
                                                <Text style={styles.diagCount}>{count} Muayene</Text>
                                            </View>
                                            <View style={styles.diagBarBg}>
                                                <View style={[styles.diagBarFill, { width: `${percent}%` }]} />
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    </View>

                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Cinsiyete Göre Sağlık Takibi</Text>
                        <PieChart
                            data={genderData}
                            width={screenWidth - 20}
                            height={170}
                            chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                        />
                    </View>
                </>
            )}

            <Modal
                visible={activeModal !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setActiveModal(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={[
                                styles.modalTitle,
                                { color: activeModal === 'passive' ? '#e53e3e' : '#dd6b20' }
                            ]}>
                                {activeModal === 'passive' ? 'Süresi Dolmuş Sertifikalar' : 'Yaklaşan Sertifikalar (30 Gün)'}
                            </Text>
                            <TouchableOpacity onPress={() => setActiveModal(null)}>
                                <Text style={styles.closeBtnText}>Kapat</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={activeModal === 'passive' ? passiveCertificates : upcomingCertificates}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            ListEmptyComponent={
                                <Text style={styles.emptyModalText}>Bu kriterde sertifika bulunamadı.</Text>
                            }
                            renderItem={({ item }) => (
                                <View style={[
                                    styles.modalItemRow,
                                    { borderLeftColor: activeModal === 'passive' ? '#e53e3e' : '#dd6b20' }
                                ]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.modalCertName}>
                                            {item.certificate_name || 'Sağlık Sertifikası'}
                                        </Text>
                                        <Text style={styles.modalEmployeeName}>
                                            Personel: {item.employee_name || 'Bilinmiyor'}
                                        </Text>
                                        <Text style={styles.modalExpiryDate}>
                                            Bitiş Tarihi: {item.expiry_date || 'Süresi Doldu'}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        color: '#00796b',
        fontSize: 14,
        fontWeight: '500'
    },
    sectionHeaderTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 10
    },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16
    },
    kpiCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 4,
        elevation: 2
    },
    warningCard: {
        backgroundColor: '#fffaf0'
    },
    alertCard: {
        backgroundColor: '#fff5f5'
    },
    badgeAlert: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 4
    },
    badgeAlertText: {
        fontSize: 9,
        fontWeight: 'bold'
    },
    kpiValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a202c'
    },
    kpiLabel: {
        fontSize: 11,
        color: '#718096',
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
        color: '#2d3748'
    },
    chartSubTitle: {
        fontSize: 11,
        color: '#a0aec0',
        marginBottom: 12
    },
    heatmapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8
    },
    heatmapItem: {
        alignItems: 'center',
        gap: 4
    },
    heatmapCountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4a5568'
    },
    heatmapSquare: {
        width: 32,
        height: 32,
        borderRadius: 6
    },
    heatmapDayText: {
        fontSize: 11,
        color: '#718096'
    },
    diagRowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    diagName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2d3748'
    },
    diagCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#00796b'
    },
    diagBarBg: {
        height: 8,
        backgroundColor: '#edf2f7',
        borderRadius: 4,
        overflow: 'hidden'
    },
    diagBarFill: {
        height: '100%',
        backgroundColor: '#00796b',
        borderRadius: 4
    },
    emptyText: {
        fontSize: 12,
        color: '#a0aec0',
        fontStyle: 'italic'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7'
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    closeBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#718096'
    },
    emptyModalText: {
        textAlign: 'center',
        paddingVertical: 30,
        color: '#38a169',
        fontWeight: '500'
    },
    modalItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f7fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 3
    },
    modalCertName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a202c'
    },
    modalEmployeeName: {
        fontSize: 12,
        color: '#4a5568',
        marginTop: 2
    },
    modalExpiryDate: {
        fontSize: 11,
        color: '#e53e3e',
        fontWeight: '600',
        marginTop: 2
    },
});