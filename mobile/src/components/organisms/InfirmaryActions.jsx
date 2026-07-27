import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-native-navigation/native';
import Button from '../atoms/Button';

export default function InfirmaryActions({ employeeId, style }) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Button
          onPress={() => navigation.navigate('AddExamination', { employeeId })}
          style={styles.halfButton}
          textStyle={styles.buttonText}
        >
          Yeni Muayene Ekle
        </Button>

        <Button
          onPress={() => navigation.navigate('ExaminationHistory', { employeeId })}
          style={styles.halfButton}
          textStyle={styles.buttonText}
        >
          Geçmiş Muayeneleri Gör
        </Button>
      </View>

      <Button
        onPress={() => navigation.navigate('HealthCertificates', { employeeId })}
        style={styles.fullButton}
        textStyle={styles.buttonText}
      >
        Personel Sağlık Sertifikalarını Yönet
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 15,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  halfButton: {
    flex: 1,
    backgroundColor: '#70b1ab',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fullButton: {
    width: '100%',
    backgroundColor: '#70b1ab',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});