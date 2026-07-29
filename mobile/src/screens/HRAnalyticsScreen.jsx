import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Header from '../components/organisms/Header';

const screenWidth = Dimensions.get('window').width - 32;

export default function HRAnalyticsScreen({ route, navigation }) {
  const { employeesData = [] } = route.params || {};

  const maleCount = employeesData.filter(e => 
    (e.gender || e.Cinsiyet || '').toLowerCase().startsWith('e')
  ).length;
  
  const femaleCount = employeesData.filter(e => 
    (e.gender || e.Cinsiyet || '').toLowerCase().startsWith('k')
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
    (e.status || e.Status || 'Aktif').toLowerCase().includes('aktif')
  ).length;
  
  const inactiveCount = employeesData.length - activeCount;

  const deptCounts = {};
  employeesData.forEach(e => {
    const dept = e.department_name || e.role_name || 'Belirtilmemiş';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const totalEmployees = employeesData.length || 1; 

  const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Header
        title="İnsan Kaynakları Analitiği"
        backgroundColor="#f7a33c"
        backButtonText="Geri Dön"
        onBackPress={() => navigation.goBack()}
      />

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