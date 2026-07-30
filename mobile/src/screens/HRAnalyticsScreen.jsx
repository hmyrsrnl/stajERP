import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';

const screenWidth = Dimensions.get('window').width - 32;

export default function HRAnalyticsScreen({ route, navigation }) {
  const initialData = route.params?.employeesData || [];

  const [employees, setEmployees] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHRAnalyticsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await apiClient.get('/employees.php');
      const fetchedData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setEmployees(fetchedData);
    } catch (err) {
      console.error("İK Analitik Veri Çekme Hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (initialData.length === 0) {
      fetchHRAnalyticsData(false);
    }
  }, [fetchHRAnalyticsData, initialData.length]);

  const onRefresh = () => {
    fetchHRAnalyticsData(true);
  };

  const employeesData = Array.isArray(employees) ? employees : [];

  const maleCount = employeesData.filter(e =>
    String(e.gender ).toLowerCase().startsWith('e')
  ).length;

  const femaleCount = employeesData.filter(e =>
    String(e.gender ).toLowerCase().startsWith('k')
  ).length;

  const genderData = [
    {
      name: 'Erkek',
      population: maleCount,
      color: '#82b2df',
      legendFontColor: '#2d3748',
      legendFontSize: 13,
    },
    {
      name: 'Kadın',
      population: femaleCount,
      color: '#ef92bf',
      legendFontColor: '#2d3748',
      legendFontSize: 13,
    }
  ];

  const activeCount = employeesData.filter(e =>
    String(e.status ).toLowerCase().includes('aktif')
  ).length;

  const inactiveCount = employeesData.length - activeCount;

  const deptCounts = {};
  employeesData.forEach(e => {
    const dept = e.department_name || 'Belirtilmemiş';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const totalEmployees = employeesData.length || 1;
  const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  let ageGroup18_25 = 0;
  let ageGroup26_35 = 0;
  let ageGroup36_45 = 0;
  let ageGroup46_Plus = 0;

  employeesData.forEach(e => {
    const age = calculateAge(e.birth_date );
    if (age !== null) {
      if (age <= 25) ageGroup18_25++;
      else if (age <= 35) ageGroup26_35++;
      else if (age <= 45) ageGroup36_45++;
      else ageGroup46_Plus++;
    }
  });

  const ageChartData = {
    labels: ["<25", "26-35", "36-45", "46+"],
    datasets: [{ data: [ageGroup18_25, ageGroup26_35, ageGroup36_45, ageGroup46_Plus] }]
  };

  const calculateTenureYears = (startDateStr) => {
    if (!startDateStr) return 0;
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return 0;
    const today = new Date();
    return (today - start) / (1000 * 60 * 60 * 24 * 365.25);
  };

  let tenureLessThan1 = 0;
  let tenure1To3 = 0;
  let tenure3To5 = 0;
  let tenureMoreThan5 = 0;

  employeesData.forEach(e => {
    const years = calculateTenureYears(e.hire_date);
    if (years < 1) tenureLessThan1++;
    else if (years <= 3) tenure1To3++;
    else if (years <= 5) tenure3To5++;
    else tenureMoreThan5++;
  });

  const tenureChartData = [
    {
      name: `0-1 Yıl (${tenureLessThan1} Kişi)`,
      population: tenureLessThan1,
      color: '#f6ad55',
      legendFontColor: '#2d3748',
      legendFontSize: 12
    },
    {
      name: `1-3 Yıl (${tenure1To3} Kişi)`,
      population: tenure1To3,
      color: '#4299e1',
      legendFontColor: '#2d3748',
      legendFontSize: 12
    },
    {
      name: `3-5 Yıl (${tenure3To5} Kişi)`,
      population: tenure3To5,
      color: '#48bb78',
      legendFontColor: '#2d3748',
      legendFontSize: 12
    },
    {
      name: `5+ Yıl (${tenureMoreThan5} Kişi)`,
      population: tenureMoreThan5,
      color: '#9f7aea',
      legendFontColor: '#2d3748',
      legendFontSize: 12
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f7a33c']}
            tintColor="#f7a33c"
          />
        }
      >
        <Header
          title="İnsan Kaynakları Analitiği"
          backgroundColor="#f7a33c"
          backButtonText="Geri Dön"
          onBackPress={() => navigation.goBack()}
        />
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f7a33c" />
            <Text style={styles.loadingText}>Analitik verileri yükleniyor...</Text>
          </View>
        ) : (
          <>
            <View style={styles.kpiContainer}>
              <View style={[styles.kpiCard, { borderLeftColor: '#f7a33c' }]}>
                <Text style={styles.kpiValue}>{employeesData.length}</Text>
                <Text style={styles.kpiLabel}>Toplam Personel</Text>
              </View>

              <View style={[styles.kpiCard, { borderLeftColor: '#38a169' }]}>
                <Text style={styles.kpiValue}>{activeCount}</Text>
                <Text style={styles.kpiLabel}>Aktif Çalışan</Text>
              </View>

              <View style={[styles.kpiCard, { borderLeftColor: '#e53e3e' }]}>
                <Text style={styles.kpiValue}>{inactiveCount}</Text>
                <Text style={styles.kpiLabel}>Pasif / Ayrılmış</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Cinsiyet Dağılımı</Text>
              <PieChart
                data={genderData}
                width={screenWidth - 20}
                height={180}
                chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Departmanlara Göre Dağılım</Text>

              <View style={styles.deptListContainer}>
                {sortedDepts.map(([deptName, count], index) => {
                  const percentage = Math.round((count / totalEmployees) * 100);

                  return (
                    <View key={index} style={styles.deptRow}>
                      <View style={styles.deptHeader}>
                        <Text style={styles.deptName}>{deptName}</Text>
                        <Text style={styles.deptCount}>{count} Personel ({percentage}%)</Text>
                      </View>

                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${percentage}%` }
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Yaş Grubu Dağılımı</Text>
              <BarChart
                data={ageChartData}
                width={screenWidth - 32}
                height={180}
                yAxisLabel=""
                yAxisSuffix=" Kişi"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(247, 163, 60, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
                }}
                style={{ borderRadius: 8, marginTop: 8 }}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Çalışma Süresi Dağılımı</Text>
              <PieChart
                data={tenureChartData}
                width={screenWidth - 20}
                height={170}
                chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[0, 0]}
                hasLegend={true}
              />
            </View>

          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7a33c',
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
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#f7a33c',
    fontSize: 14,
    fontWeight: '500',
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 14,
  },
  deptListContainer: {
    gap: 14,
  },
  deptRow: {
    width: '100%',
  },
  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d3748',
  },
  deptCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f7a33c',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#edf2f7',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f7a33c',
    borderRadius: 5,
  },
});