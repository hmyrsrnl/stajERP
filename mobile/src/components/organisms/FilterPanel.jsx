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
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { borderBottomColor: themeColor }]}>
        Filtreleme
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Personel Ara</Text>
        <TextInput
          placeholder="İsim veya Soyisim ile ara..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={(text) => onSearchChange && onSearchChange(text)}
          style={styles.searchInput}
        />
      </View>

      {showGenders && (
        <View style={styles.section}>
          <FilterGroup
            title="Cinsiyet"
            items={['Kadın', 'Erkek']}
            selectedItems={selectedGenders}
            onItemChange={onGenderChange}
          />
        </View>
      )}

      {showDepartments && (
        <View style={styles.section}>
          <Text style={styles.label}>Departmanlar</Text>
          <FilterGroup
            items={departments}
            selectedItems={selectedDepts}
            onItemChange={onDeptChange}
          />
        </View>
      )}

      <View style={styles.section}>
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
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    borderBottomWidth: 2,
    paddingBottom: 6,
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
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
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  exportButton: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#1f804e',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exportButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});