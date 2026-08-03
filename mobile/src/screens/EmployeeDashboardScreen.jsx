import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';

import Header from '../components/organisms/Header';
import NotificationBanner from '../components/molecules/NotificationBanner';
import ProfileInfoCard from '../components/molecules/ProfileInfoCard';

export default function EmployeeDashboardScreen({ navigation }) {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isWelder, setIsWelder] = useState(false);
  const [examStats, setExamStats] = useState({ total: 0, lastDate: '-', types: {} });
  const [HealthCertStats, setHealthCertStats] = useState({ active: 0, expired: 0, nearestExpiry: '-' });
  const [healthCertificates, setHealthCertificates] = useState([]);
  const [showHealthCerts, setShowHealthCerts] = useState(false);
  const [certStats, setCertStats] = useState({ active: 0, expired: 0, nearestExpiry: '-' });
  const [welderCertificates, setWelderCertificates] = useState([]);
  const [showWelderCerts, setShowWelderCerts] = useState(false);

  const fetchData = async () => {
    try {
      const employeeId = await AsyncStorage.getItem('employee_id');

      if (!employeeId || employeeId === "null") {
        Alert.alert("Hata", "Lütfen önce sisteme giriş yapın!");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      const empRes = await apiClient.get(`/employee_detail.php?id=${employeeId}`);
      const empData = empRes.data?.data || empRes.data;
      if (empData) {
        setEmployeeInfo(empData);

        const unvanText = String(
          empData.role_name 
        ).toLowerCase();

        const welderCheck = unvanText.includes('kaynakçı');
        setIsWelder(welderCheck);
      }

      try {
        const noteRes = await apiClient.get(`/notifications.php?action=list&employee_id=${employeeId}`);
        const notes = Array.isArray(noteRes.data) ? noteRes.data : (noteRes.data?.data || []);
        setNotifications(notes);
      } catch (e) {
        console.log("Bildirimler çekilemedi:", e);
      }

      try {
        const examRes = await apiClient.get(`/infirmary.php?action=list&employee_id=${employeeId}`);
        const exams = Array.isArray(examRes.data) ? examRes.data : [];

        if (exams.length > 0) {
          const typesMap = {};
          exams.forEach(item => {
            const type = item.exam_type || 'Genel';
            typesMap[type] = (typesMap[type] || 0) + 1;
          });

          setExamStats({
            total: exams.length,
            lastDate: exams[0].exam_date || exams[0].created_at || '-',
            types: typesMap
          });
        } else {
          setExamStats({ total: 0, lastDate: 'Kayıt Yok', types: {} });
        }
      } catch (e) {
        console.log("Muayene geçmişi çekilemedi:", e);
      }

      try {
        const certRes = await apiClient.get(`/health_certificates.php?action=list&employee_id=${employeeId}`);
        const certs = Array.isArray(certRes.data) ? certRes.data : [];

        setHealthCertificates(certs);

        const today = new Date();
        let activeCount = 0;
        let expiredCount = 0;
        let nearest = '-';

        certs.forEach(c => {
          const expDateStr = c.expiry_date;
          const isExpired = expDateStr && new Date(expDateStr) < today;
          const isPassive = String(c.status || '').toLowerCase() === 'pasif';

          if (isExpired || isPassive) {
            expiredCount++;
          } else {
            activeCount++;
            if (expDateStr && (nearest === '-' || new Date(expDateStr) < new Date(nearest))) {
              nearest = expDateStr;
            }
          }
        });

        setHealthCertStats({
          active: activeCount,
          expired: expiredCount,
          nearestExpiry: nearest
        });

      } catch (e) {
        console.log("Sağlık sertifikaları çekilemedi:", e);
      }
      try {
        const certRes = await apiClient.get(`/quality_control.php?action=list&employee_id=${employeeId}`);
        const certs = Array.isArray(certRes.data) ? certRes.data : [];

        setWelderCertificates(certs);

        const today = new Date();
        let activeCount = 0;
        let expiredCount = 0;
        let nearest = '-';

        certs.forEach(c => {
          const expDateStr = c.expiry_date;
          const isExpired = expDateStr && new Date(expDateStr) < today;
          const isPassive = String(c.status || '').toLowerCase() === 'pasif';

          if (isExpired || isPassive) {
            expiredCount++;
          } else {
            activeCount++;
            if (expDateStr && (nearest === '-' || new Date(expDateStr) < new Date(nearest))) {
              nearest = expDateStr;
            }
          }
        });

        setCertStats({
          active: activeCount,
          expired: expiredCount,
          nearestExpiry: nearest
        });

      } catch (e) {
        console.log("Kaynakçı sertifikaları çekilemedi:", e);
      }

    } catch (err) {
      console.error("Çalışan paneli veri hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Oturumunuz kapatılacaktır. Emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('employee_id');
            await AsyncStorage.removeItem('user');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b5876" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2b5876']} />
      }
    >
      <Header
        title={employeeInfo ? `Hoş Geldiniz, ${employeeInfo.first_name} ${employeeInfo.last_name}` : 'Çalışan Paneli'}
        backgroundColor="#2b5876"
        backButtonText="Çıkış Yap"
        onBackPress={handleLogout}
      />

      <NotificationBanner notifications={notifications} />

      <View style={styles.mainContent}>
        <ProfileInfoCard employeeInfo={employeeInfo} />

        <View style={styles.cardWrapper}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Muayene Özetim</Text>
            <Text style={styles.badgeTotal}>{examStats.total} Kayıt</Text>
          </View>

          <Text style={styles.subInfoText}>Son Muayene Tarihi: <Text style={styles.boldText}>{examStats.lastDate}</Text></Text>

          <View style={{ gap: 8, marginTop: 10 }}>
            {Object.keys(examStats.types).length === 0 ? (
              <Text style={styles.emptyText}>Kayıtlı muayeneniz bulunmamaktadır.</Text>
            ) : (
              Object.entries(examStats.types).map(([typeName, count], idx) => {
                const percent = Math.round((count / examStats.total) * 100);
                return (
                  <View key={idx}>
                    <View style={styles.progressTextRow}>
                      <Text style={styles.typeLabel}>{typeName}</Text>
                      <Text style={styles.typeCount}>{count} Kez (%{percent})</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: '#00796b' }]} />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={styles.cardWrapper}>
          <TouchableOpacity 
            style={styles.cardHeaderRow}
            activeOpacity={0.7}
            onPress={() => setShowHealthCerts(!showHealthCerts)}
          >
            <Text style={styles.cardTitle}>
              Sağlık Sertifikası Durumum {showHealthCerts ? '-' : '+'}
            </Text>
            <Text style={styles.badgeTotal}>{healthCertificates.length} Sertifika</Text>
          </TouchableOpacity>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: '#e6fffa', borderColor: '#38b2ac' }]}>
              <Text style={[styles.statNumber, { color: '#234e52' }]}>{HealthCertStats.active}</Text>
              <Text style={styles.statLabel}>Aktif Sertifika</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: '#fff5f5', borderColor: '#feb2b2' }]}>
              <Text style={[styles.statNumber, { color: '#9b2c2c' }]}>{HealthCertStats.expired}</Text>
              <Text style={styles.statLabel}>Pasif Sertifika</Text>
            </View>
          </View>

          <View style={styles.expiryNoteRow}>
            <Text style={styles.expiryNoteText}>
              En Yakın Bitiş Tarihi: <Text style={{ fontWeight: 'bold', color: '#dd6b20' }}>{HealthCertStats.nearestExpiry}</Text>
            </Text>
          </View>

          {showHealthCerts && (
            <View style={styles.certListContainer}>
              {healthCertificates.length === 0 ? (
                <Text style={styles.emptyText}>Sisteme tanımlı sağlık sertifikanız bulunmamaktadır.</Text>
              ) : (
                healthCertificates.map((cert, index) => {
                  const today = new Date();
                  const expDate = cert.expiry_date ? new Date(cert.expiry_date) : null;
                  const isExpired = expDate && expDate < today;
                  const isPassive = String(cert.status || '').toLowerCase() === 'pasif';

                  const isCertInactive = isExpired || isPassive;

                  return (
                    <View 
                      key={cert.id} 
                      style={[
                        styles.certItemCard, 
                        { borderLeftColor: isCertInactive ? '#e53e3e' : '#38a169' }
                      ]}
                    >
                      <View style={styles.certHeaderRow}>
                        <Text style={styles.certName}>{cert.certificate_name || 'Sağlık Sertifikası'}</Text>
                        <View style={[
                          styles.certStatusBadge, 
                          { backgroundColor: isCertInactive ? '#fff5f5' : '#e6fffa' }
                        ]}>
                          <Text style={[
                            styles.certStatusText, 
                            { color: isCertInactive ? '#e53e3e' : '#38a169' }
                          ]}>
                            {isCertInactive ? 'Pasif' : 'Aktif'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.certDetailText}>
                        Veriliş Tarihi: <Text style={styles.boldText}>{cert.issue_date || '-'}</Text>
                      </Text>
                      <Text style={styles.certDetailText}>
                        Geçerlilik Tarihi: <Text style={styles.boldText}>{cert.expiry_date || 'Süresiz'}</Text>
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>

        {isWelder && (
          <View style={styles.cardWrapper}>
            <TouchableOpacity 
              style={styles.cardHeaderRow}
              activeOpacity={0.7}
              onPress={() => setShowWelderCerts(!showWelderCerts)}
            >
              <Text style={styles.cardTitle}>
                Kaynakçı Sertifikalarım {showWelderCerts ? '-' : '+'}
              </Text>
              <Text style={[styles.badgeTotal, { color: '#76399c', backgroundColor: '#f3e8ff' }]}>
                {welderCertificates.length} Sertifika
              </Text>
            </TouchableOpacity>

            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: '#e6fffa', borderColor: '#38b2ac' }]}>
                <Text style={[styles.statNumber, { color: '#234e52' }]}>{certStats.active}</Text>
                <Text style={styles.statLabel}>Aktif Sertifika</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: '#fff5f5', borderColor: '#feb2b2' }]}>
                <Text style={[styles.statNumber, { color: '#9b2c2c' }]}>{certStats.expired}</Text>
                <Text style={styles.statLabel}>Pasif Sertifika</Text>
              </View>
            </View>

            <View style={styles.expiryNoteRow}>
              <Text style={styles.expiryNoteText}>
                En Yakın Bitiş Tarihi: <Text style={{ fontWeight: 'bold', color: '#dd6b20' }}>{certStats.nearestExpiry}</Text>
              </Text>
            </View>

            {showWelderCerts && (
              <View style={styles.certListContainer}>
                {welderCertificates.length === 0 ? (
                  <Text style={styles.emptyText}>Sisteme tanımlı kaynakçı sertifikanız bulunmamaktadır.</Text>
                ) : (
                  welderCertificates.map((cert, index) => {
                    const today = new Date();
                    const expDate = cert.expiry_date ? new Date(cert.expiry_date) : null;
                    const isExpired = expDate && expDate < today;
                    const isPassive = String(cert.status || '').toLowerCase() === 'pasif';

                    const isCertInactive = isExpired || isPassive;

                    return (
                      <View 
                        key={cert.id} 
                        style={[
                          styles.certItemCard, 
                          { borderLeftColor: isCertInactive ? '#e53e3e' : '#38a169' }
                        ]}
                      >
                        <View style={styles.certHeaderRow}>
                          <Text style={styles.certName}>{cert.certificate_name || cert.title || 'Kaynakçı Sertifikası'}</Text>
                          <View style={[
                            styles.certStatusBadge, 
                            { backgroundColor: isCertInactive ? '#fff5f5' : '#e6fffa' }
                          ]}>
                            <Text style={[
                              styles.certStatusText, 
                              { color: isCertInactive ? '#e53e3e' : '#38a169' }
                            ]}>
                              {isCertInactive ? 'Pasif' : 'Aktif'}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.certDetailText}>
                          Veriliş Tarihi: <Text style={styles.boldText}>{cert.issue_date || '-'}</Text>
                        </Text>
                        <Text style={styles.certDetailText}>
                          Geçerlilik Tarihi: <Text style={styles.boldText}>{cert.expiry_date || 'Süresiz'}</Text>
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  mainContent: {
    marginTop: 15,
    gap: 16,
  },
  cardWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  badgeTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00796b',
    backgroundColor: '#e6fffa',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  subInfoText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 6,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2d3748',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '500',
  },
  typeCount: {
    fontSize: 11,
    color: '#718096',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#edf2f7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#a0aec0',
    fontStyle: 'italic',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#4a5568',
    marginTop: 2,
  },
  expiryNoteRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
  },
  expiryNoteText: {
    fontSize: 12,
    color: '#4a5568',
  },
  certListContainer: {
    marginTop: 14,
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  certItemCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#edf2f7',
    gap: 4,
  },
  certHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  certName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a202c',
    flex: 1,
  },
  certStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  certStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  certDetailText: {
    fontSize: 11,
    color: '#64748b',
  },
});