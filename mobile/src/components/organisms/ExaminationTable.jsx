import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExaminationTable({ 
  examinations = [], 
  style 
}) {
  if (!examinations || examinations.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>
          Bu personele ait geçmiş bir muayene kaydı bulunamadı.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {examinations.map((exam) => {
        const isPeriyodik = exam.exam_type === 'Periyodik';

        return (
          <View key={exam.id || exam.ID} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.dateText}>{exam.exam_date}</Text>
              
              <View style={[
                styles.typeBadge,
                isPeriyodik ? styles.periyodikBadge : styles.gunlukBadge
              ]}>
                <Text style={[
                  styles.typeBadgeText,
                  isPeriyodik ? styles.periyodikBadgeText : styles.gunlukBadgeText
                ]}>
                  {exam.exam_type}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Sonuç / Tanı: </Text>
              <Text style={styles.resultText}>{exam.result}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Açıklama / Reçete: </Text>
              <Text style={styles.descriptionText}>{exam.description || '-'}</Text>
            </View>

            <View style={styles.doctorRow}>
              <Text style={styles.doctorLabel}>Hekim: </Text>
              <Text style={styles.doctorName}>{exam.doctor_name || 'Bilinmeyen Hekim'}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777777',
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 8,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifycontent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#004d40',
  },
  typeBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  periyodikBadge: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00acc1',
  },
  gunlukBadge: {
    backgroundColor: '#fff3e0',
    borderColor: '#ffb74d',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  periyodikBadgeText: {
    color: '#006064',
  },
  gunlukBadgeText: {
    color: '#e65100',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
  },
  resultText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212529',
    flexShrink: 1,
  },
  descriptionText: {
    fontSize: 13,
    color: '#555555',
    flexShrink: 1,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  doctorLabel: {
    fontSize: 12,
    color: '#777777',
  },
  doctorName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#495057',
  },
});