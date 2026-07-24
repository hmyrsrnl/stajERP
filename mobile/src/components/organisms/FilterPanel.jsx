import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import FilterGroup from '../molecules/FilterGroup';
import Button from '../atoms/Button';

export default function FilterPanel({
  searchTerm = '',
  onSearchChange,
  departments = [],
  selectedGenders = [],
  onGenderChange,
  selectedDepts = [],
  onDeptChange,
  selectedStatus = [],
  onStatusChange,
  showDepartments = true,
  showGenders = true,
  themeColor = '#f7a33c',
  onExport,
  style
}) {
  return (
    <View style={[styles.panelContainer, style]}>
      <Text style={[styles.panelTitle, { borderBottomColor: themeColor }]}>
        Filtreleme
      </Text>

      <View style={styles.sectionGroup}>
        <Text style={styles.label}>Personel Ara</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="İsim veya Soyisim ile ara..."
          placeholderTextColor="#a0aec0"
          value={searchTerm}
          onChangeText={(text) => onSearchChange && onSearchChange(text)}
        />
      </View>

      {showGenders && (
        <View style={styles.sectionGroup}>
          <FilterGroup
            title="Cinsiyet"
            items={['Kadın', 'Erkek']}
            selectedItems={selectedGenders}
            onItemChange={onGenderChange}
          />
        </View>
      )}

      {showDepartments && (
        <View style={styles.sectionGroup}>
          <Text style={styles.label}>Departmanlar</Text>
          <FilterGroup
            items={departments}
            selectedItems={selectedDepts}
            onItemChange={onDeptChange}
          />
        </View>
      )}

      <View style={styles.sectionGroupLarge}>
        <FilterGroup
          title="Çalışan Durumu"
          items={['Aktif', 'Pasif']}
          selectedItems={selectedStatus}
          onItemChange={onStatusChange}
        />
      </View>

      {onExport && (
        <Button
          onPress={onExport}
          style={styles.exportButton}
          textStyle={styles.exportButtonText}
        >
          Excel Olarak İndir
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10,
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: 15,
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    paddingBottom: 5,
    textAlign: 'left',
  },
  sectionGroup: {
    marginBottom: 20,
  },
  sectionGroupLarge: {
    marginBottom: 25,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    fontSize: 14,
  },
  searchInput: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    color: '#2d3748',
    backgroundColor: '#ffffff',
    width: '100%',
  },
  exportButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#1f804e',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exportButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});