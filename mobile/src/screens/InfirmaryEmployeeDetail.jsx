import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import ExaminationTable from '../components/organisms/ExaminationTable';
import HealthCertificatesTable from '../components/organisms/HealthCertificatesTable';
import HealthDetailCard from '../components/molecules/HealthDetailCard';

export default function InfirmaryEmployeeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [employee, setEmployee] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showExaminations, setShowExaminations] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  const fetchDetailData = useCallback(async (isRefresh = false) => {
    if (!id) {
      Alert.alert("Hata", "Çalışan kimliği bulunamadı.");
      navigation.goBack();
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const empRes = await apiClient.get(`/employee_detail.php?id=${id}`);
      if (empRes.data) {
        setEmployee(empRes.data);
      }

      try {
        const examRes = await apiClient.get(`/infirmary.php?action=list&employee_id=${id}`);
        if (Array.isArray(examRes.data)) {
          setExaminations(examRes.data);
        }
      } catch (e) {
        console.error("Muayene verisi çekilemedi:", e);
      }

      try {
        const certRes = await apiClient.get(`/health_certificates.php?action=list&employee_id=${id}`);
        const rawCertData = certRes.data?.data || certRes.data;
        if (Array.isArray(rawCertData)) {
          setCertificates(rawCertData);
        } else {
          const certResFallback = await apiClient.get(`/health_certificates.php?employee_id=${id}`);
          if (Array.isArray(certResFallback.data)) {
            setCertificates(certResFallback.data);
          }
        }
      } catch (e) {
        console.error("Sertifika verisi çekilemedi:", e);
      }

    } catch (err) {
      console.error("Çalışan genel detay hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchDetailData(false);
  }, [fetchDetailData]);

  const onRefresh = () => {
    fetchDetailData(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00796b" />

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
          title="Personel Sağlık Kartı"
          backgroundColor="#00796b"
          backButtonText="Geri Dön"
          onBackPress={() => navigation.goBack()}
        />

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00796b" />
            <Text style={styles.loadingText}>Sağlık detayları yükleniyor...</Text>
          </View>
        ) : !employee ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Çalışana ait veri bulunamadı.</Text>
          </View>
        ) : (
          <View style={styles.mainWrapper}>

            <View style={styles.cardWrapper}>
              <HealthDetailCard employee={employee} />
            </View>

            <View style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setShowExaminations(!showExaminations)}
                activeOpacity={0.7}
              >
                <Text style={styles.accordionTitle}>
                  Geçmiş Muayene Kayıtları ({examinations.length})
                </Text>
                <Text style={styles.accordionIcon}>
                  {showExaminations ? "-" : "+"}
                </Text>
              </TouchableOpacity>

              {showExaminations && (
                <View style={styles.accordionContent}>
                  <ExaminationTable
                    examinations={examinations}
                    isReadOnly={true}
                  />
                </View>
              )}
            </View>

            <View style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setShowCertificates(!showCertificates)}
                activeOpacity={0.7}
              >
                <Text style={styles.accordionTitle}>
                  Sağlık Sertifikaları ve Raporlar ({certificates.length})
                </Text>
                <Text style={styles.accordionIcon}>
                  {showCertificates ? "-" : "+"}
                </Text>
              </TouchableOpacity>

              {showCertificates && (
                <View style={styles.accordionContent}>
                  <HealthCertificatesTable
                    certificates={certificates}
                    isReadOnly={true}
                  />
                </View>
              )}
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00796b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#00796b',
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#c53030',
  },
  mainWrapper: {
    gap: 14,
    marginTop: 15,
  },
  cardWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  accordionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    elevation: 2,
  },
  accordionHeader: {
    padding: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  accordionIcon: {
    fontSize: 12,
    color: '#00796b',
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    gap: 10,
  },
});