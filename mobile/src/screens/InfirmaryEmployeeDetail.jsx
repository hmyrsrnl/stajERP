import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import HealthDetailCard from '../components/molecules/HealthDetailCard';

export default function InfirmaryEmployeeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [employee, setEmployee] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExaminations, setShowExaminations] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  useEffect(() => {
    if (!id) {
      Alert.alert("Hata", "Çalışan kimliği bulunamadı.");
      navigation.goBack();
      return;
    }

    const fetchDetailData = async () => {
      try {
        setLoading(true);

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
      }
    };

    fetchDetailData();
  }, [id]);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
    >
      <Header
        title="Personel Sağlık Kartı"
        backgroundColor="#00796b"
        backButtonText="Geri Dön"
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
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
                {examinations.length === 0 ? (
                  <Text style={styles.emptyText}>Kayıtlı muayene bulunmamaktadır.</Text>
                ) : (
                  examinations.map((exam, index) => (
                    <View key={exam.id} style={styles.itemRow}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>
                          {exam.exam_type}
                        </Text>
                        <Text style={styles.itemDate}>
                          {exam.exam_date}
                        </Text>
                      </View>
                      <Text style={styles.itemDetail}>
                        <Text style={styles.boldText}>Şikayet/Teşhis:</Text> {exam.result}
                      </Text>
                      <Text style={styles.itemDetail}>
                        <Text style={styles.boldText}>Tedavi/Not:</Text> {exam.description}
                      </Text>
                    </View>
                  ))
                )}
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
                {certificates.length === 0 ? (
                  <Text style={styles.emptyText}>Kayıtlı sağlık sertifikası bulunmamaktadır.</Text>
                ) : (
                  certificates.map((cert, index) => {
                    const expiryDateStr = cert.expiry_date;
                    const dbStatus = cert.status;

                    let isExpired = false;
                    if (expiryDateStr) {
                      const today = new Date();
                      const expiryDate = new Date(expiryDateStr);
                      if (expiryDate.toString() !== 'Invalid Date' && today > expiryDate) {
                        isExpired = true;
                      }
                    }

                    const isPassive = isExpired || String(dbStatus).toLowerCase() === 'pasif';
                    const displayStatus = isPassive ? 'Pasif' : dbStatus;

                    return (
                      <View key={cert.id || cert.ID || index} style={styles.itemRow}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemTitle}>
                            {cert.certificate_name}
                          </Text>
                          
                          <Text style={[
                            styles.statusBadge, 
                            { 
                              backgroundColor: isPassive ? '#fed7d7' : '#c6f6d5',
                              color: isPassive ? '#9b2c2c' : '#22543d'
                            }
                          ]}>
                            {displayStatus}
                          </Text>
                        </View>
                        <Text style={styles.itemDetail}>
                          <Text style={styles.boldText}>Veriliş Tarihi:</Text> {cert.issue_date}
                        </Text>
                        <Text style={styles.itemDetail}>
                          <Text style={styles.boldText}>Bitiş Tarihi:</Text> {expiryDateStr || '-'}
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>

        </View>
      )}
    </ScrollView>
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
  emptyText: {
    fontSize: 13,
    color: '#a0aec0',
    fontStyle: 'italic',
    marginTop: 10,
  },
  itemRow: {
    backgroundColor: '#f7fafc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00796b',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  itemDate: {
    fontSize: 11,
    color: '#718096',
  },
  itemDetail: {
    fontSize: 12,
    color: '#4a5568',
    marginTop: 2,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2d3748',
  },
  statusBadge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: 'bold',
  },
});