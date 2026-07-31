import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import Header from '../components/organisms/Header';
import apiClient from '../api/client';

const screenWidth = Dimensions.get('window').width - 32;

export default function AdminPanelScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRiskCertList, setShowRiskCertList] = useState(false);

  const [kpiStats, setKpiStats] = useState({
    activeEmployees: 0,
    passiveEmployees: 0,
    monthlyExamsCount: 0,
    riskCertificatesCount: 0,
    totalSalaryBudget: 0,
  });
  const [deptChartData, setDeptChartData] = useState({ labels: ['-'], datasets: [{ data: [0] }] });
  const [certRiskData, setCertRiskData] = useState([]);
  const [riskCertList, setRiskCertList] = useState([]);
  const [examTrendData, setExamTrendData] = useState({ labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'], datasets: [{ data: [0, 0, 0, 0, 0, 0] }] });
  const [salaryChartData, setSalaryChartData] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);

  const fetchAdminDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiClient.get('/admin_stats.php');
      const data = res.data;

      if (data) {
        setKpiStats({
          activeEmployees: data.activeEmployees || 0,
          passiveEmployees: data.passiveEmployees || 0,
          monthlyExamsCount: data.monthlyExamsCount || 0,
          riskCertificatesCount: data.riskCertificatesCount || 0,
          totalSalaryBudget: data.totalSalaryBudget || 0,
        });

        if (data.certRiskStatus) {
          const { active, warning, expired } = data.certRiskStatus;
          const total = active + warning + expired;

          if (total > 0) {
            setCertRiskData([
              { name: `Aktif (${active})`, population: active, color: '#20c997', legendFontColor: '#2d3748', legendFontSize: 11 },
              { name: `Bitiş Yakın (${warning})`, population: warning, color: '#f59f00', legendFontColor: '#2d3748', legendFontSize: 11 },
              { name: `Süresi Dolmuş (${expired})`, population: expired, color: '#e53e3e', legendFontColor: '#2d3748', legendFontSize: 11 },
            ]);
          } else {
            setCertRiskData([
              { name: 'Aktif (0)', population: 0, color: '#20c997', legendFontColor: '#2d3748', legendFontSize: 11 },
              { name: 'Bitiş Yakın (0)', population: 0, color: '#f59f00', legendFontColor: '#2d3748', legendFontSize: 11 },
              { name: 'Süresi Dolmuş (0)', population: 0, color: '#e53e3e', legendFontColor: '#2d3748', legendFontSize: 11 },
            ]);
          }
        }

        if (data.riskCertificatesList) {
          setRiskCertList(data.riskCertificatesList);
        }

        if (data.departmentDistribution && data.departmentDistribution.length > 0) {
          const labels = data.departmentDistribution.map(d => {
            let name = (d.dept_name || 'Diğer').trim();
            if (name.toLowerCase().includes('insan') || name.toLowerCase().includes('ik')) return 'İK';
            if (name.toLowerCase().includes('sağlık')) return 'Sağlık';
            if (name.toLowerCase().includes('kalite')) return 'Kalite';
            if (name.toLowerCase().includes('üretim')) return 'Üretim';
            if (name.toLowerCase().includes('ar-ge') || name.toLowerCase().includes('arge')) return 'Ar-Ge';
            if (name.toLowerCase().includes('atanma') || name.toLowerCase().includes('belirtilme')) return 'Atanma.';
            return name.length > 6 ? name.substring(0, 5) + '.' : name;
          });

          const counts = data.departmentDistribution.map(d => Number(d.count));
          setDeptChartData({ labels, datasets: [{ data: counts }] });
        }

        if (data.examTrend && data.examTrend.length > 0) {
          const labels = data.examTrend.map(t => t.month);
          const counts = data.examTrend.map(t => Number(t.count));

          setExamTrendData({
            labels: labels,
            datasets: [{ data: counts }]
          });
        } else {
          setExamTrendData({
            labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
            datasets: [{ data: [0, 0, 0, 0, 0, 0] }]
          });
        }

        if (data.deptSalaryDistribution && data.deptSalaryDistribution.length > 0) {
          const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
          const salaryPies = data.deptSalaryDistribution.map((item, idx) => ({
            name: item.dept_name,
            population: Number(item.total_salary),
            color: colors[idx % colors.length],
            legendFontColor: '#2d3748',
            legendFontSize: 11
          }));
          setSalaryChartData(salaryPies);
        }

        if (data.roleDistribution) {
          setRoleDistribution(data.roleDistribution);
        }
      }
    } catch (err) {
      console.error("Dashboard verileri çekilemedi:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminDashboard(false);
  }, [fetchAdminDashboard]);

  const onRefresh = () => fetchAdminDashboard(true);

  const totalPersonnel = kpiStats.activeEmployees + kpiStats.passiveEmployees;
  const maxDeptCount = Math.max(...(deptChartData.datasets[0]?.data || [1]), 1);

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#b22a2a']} tintColor="#b22a2a" />
        }
      >
        <Header
          title="Sistem Yönetim Merkezi"
          backgroundColor="#b22a2a"
          backPath="DashboardSelection"
          backButtonText="Kontrol Merkezi"
        />
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#b22a2a" />
            <Text style={styles.loadingText}>Yönetici Konsolu Yükleniyor...</Text>
          </View>
        ) : (
          <View style={styles.contentPadding}>

            <Text style={styles.sectionTitle}>Şirket Genel Sağlık Karnesi</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
                <Text style={styles.statValue}>{kpiStats.activeEmployees} / {kpiStats.passiveEmployees}</Text>
                <Text style={styles.statLabel}>Aktif / Pasif Personel</Text>
              </View>

              <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                <Text style={styles.statValue}>{kpiStats.monthlyExamsCount}</Text>
                <Text style={styles.statLabel}>Bu Ayki Muayene</Text>
              </View>

              <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
                <Text style={[styles.statValue, { color: '#dc2626' }]}>{kpiStats.riskCertificatesCount}</Text>
                <Text style={styles.statLabel}>Riskli Sertifikalar</Text>
              </View>

              <View style={[styles.statCard, { borderLeftColor: '#8b5cf6' }]}>
                <Text style={[styles.statValue, { fontSize: 13 }]}>
                  ₺{Number(kpiStats.totalSalaryBudget).toLocaleString('tr-TR')}
                </Text>
                <Text style={styles.statLabel}>Aylık Maaş Yükü</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <TouchableOpacity
                style={styles.cardHeaderTouchable}
                activeOpacity={0.7}
                onPress={() => setShowRiskCertList(!showRiskCertList)}
              >
                <Text style={styles.chartTitle}>Sertifika Risk & Uyum Durumu {showRiskCertList ? '-' : '+'}</Text>
                <Text style={styles.badgeText}>{kpiStats.riskCertificatesCount} Riskli</Text>
              </TouchableOpacity>

              <PieChart
                data={certRiskData}
                width={screenWidth - 20}
                height={160}
                chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"10"}
                center={[0, 0]}
                hasLegend={true}
              />

              {showRiskCertList && (
                <View style={styles.accordionContainer}>
                  <Text style={styles.accordionTitle}>Aksiyon Gerektiren Sertifikalar:</Text>
                  {riskCertList.length === 0 ? (
                    <Text style={styles.emptyText}>Kritik veya süresi dolmuş sertifika bulunmuyor.</Text>
                  ) : (
                    riskCertList.map((item, idx) => {
                      const today = new Date();
                      const expDate = item.expiry_date ? new Date(item.expiry_date) : null;
                      const isExpired = expDate && expDate < today;

                      return (
                        <View key={idx} style={[styles.riskItemCard, { borderLeftColor: isExpired ? '#e53e3e' : '#f59f00' }]}>
                          <View style={styles.riskHeader}>
                            <Text style={styles.riskEmpName}>{item.employee_name}</Text>
                            <Text style={[styles.riskBadge, { backgroundColor: isExpired ? '#fff5f5' : '#fff9db', color: isExpired ? '#e53e3e' : '#f59f00' }]}>
                              {isExpired ? 'Süresi Dolmuş' : 'Bitişi Yakın'}
                            </Text>
                          </View>
                          <Text style={styles.riskCertName}>{item.certificate_name}</Text>
                          <Text style={styles.riskDate}>Bitiş Tarihi: <Text style={{ fontWeight: 'bold' }}>{item.expiry_date || '-'}</Text></Text>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Departman Kadro Dağılımı</Text>
              <BarChart
                data={deptChartData}
                width={screenWidth - 20}
                height={210}
                yAxisLabel=""
                yAxisSuffix=""
                segments={maxDeptCount > 4 ? 4 : maxDeptCount}
                verticalLabelRotation={0}
                fromZero={true}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(178, 42, 42, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
                  barPercentage: 0.55,
                }}
                style={styles.chartStyle}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Aylık Revir Muayene Trendi</Text>
              <LineChart
                data={examTrendData}
                width={screenWidth - 20}
                height={190}
                fromZero={true}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
                }}
                bezier
                style={styles.chartStyle}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Departman Bazlı Maaş Bütçesi</Text>
              {salaryChartData.length > 0 ? (
                <PieChart
                  data={salaryChartData}
                  width={screenWidth - 20}
                  height={170}
                  chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"10"}
                  center={[0, 0]}
                  hasLegend={true}
                />
              ) : (
                <Text style={styles.emptyText}>Maaş verisi bulunamadı.</Text>
              )}
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Rol & Yetki Dağılımı</Text>
              <View style={styles.roleListContainer}>
                {roleDistribution.map((item, idx) => {
                  const percent = totalPersonnel > 0 ? Math.round((item.count / totalPersonnel) * 100) : 0;
                  return (
                    <View key={idx} style={styles.roleRow}>
                      <View style={styles.roleHeader}>
                        <Text style={styles.roleName}>{item.role_name}</Text>
                        <Text style={styles.roleCount}>{item.count} Hesap (%{percent})</Text>
                      </View>
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${percent}%` }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.quickNavContainer}>
              <Text style={styles.quickNavTitle}>Hızlı Geçişler</Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.navButton}
                onPress={() => navigation.navigate('HRPanel')}
              >
                <Text style={styles.navButtonText}>İnsan Kaynakları Paneline Git</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.navButton}
                onPress={() => navigation.navigate('QCPanel')}
              >
                <Text style={styles.navButtonText}>Kalite Kontrol Paneline Git</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.navButton}
                onPress={() => navigation.navigate('InfirmaryPanel')}
              >
                <Text style={styles.navButtonText}>Revir Paneline Git</Text>
              </TouchableOpacity>
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
    backgroundColor: '#b22a2a'
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    color: '#b22a2a',
    fontSize: 14,
    fontWeight: '500'
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingTop: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
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
    elevation: 2,
  },
  cardHeaderTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chartStyle: {
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    paddingVertical: 12,
    fontSize: 12
  },
  accordionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4
  },
  riskItemCard: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 2,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  riskEmpName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  riskBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  riskCertName: {
    fontSize: 12,
    color: '#475569'
  },
  riskDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  roleListContainer: {
    gap: 12,
    marginTop: 4
  },
  roleRow: {
    width: '100%'
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  roleName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  roleCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b22a2a'
  },
  progressBg: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#b22a2a',
    borderRadius: 4
  },
  quickNavContainer: {
    gap: 10,
    marginTop: 10
  },
  quickNavTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4
  },
  navButton: {
    backgroundColor: '#b22a2a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14
  },
});