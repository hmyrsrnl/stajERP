import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Pagination from '../molecules/Pagination';

const departmentColors = {
  'İnsan Kaynakları': { bg: '#fdf4e9', text: '#d97706', button: '#f7a33c' },
  'Revir': { bg: '#fdf2f2', text: '#e02424', button: '#924697' },
  'Kalite Kontrol': { bg: '#f3e8ff', text: '#7e22ce', button: '#db7ae8' },
  'worker': { bg: '#f0fdf4', text: '#15803d', button: '#22c55e' }
};

const defaultColor = { bg: '#f3f4f6', text: '#4b5563', button: '#c81919' };

export default function EmployeeTable({ 
  employees = [], 
  onSelectEmployee, 
  onEditEmployee, 
  allEmployeesLength = 0,
  style 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmployees = employees.filter(emp => {
    const role = String(emp.role_name ).toLowerCase();
    return role !== 'admin';
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredEmployees.length, totalPages, currentPage]);

  return (
    <View style={[styles.container, style]}>
      
      {currentEmployees.length === 0 ? (
        <Text style={styles.emptyText}>
          {allEmployeesLength === 0 ? 'Henüz kayıtlı çalışan yok.' : 'Aradığınız kriterlere uygun çalışan bulunamadı.'}
        </Text>
      ) : (
        <View style={styles.listContainer}>
          {currentEmployees.map((emp) => {
            const colors = departmentColors[emp.role_name] || departmentColors[emp.role] || defaultColor;

            return (
              <View
                key={emp.id}
                style={[
                  styles.employeeCard,
                  { borderLeftColor: colors.text }
                ]}
              >
                <View style={styles.infoGroup}>
                  <Text style={styles.employeeName} numberOfLines={1}>
                    {emp.first_name} {emp.last_name}
                  </Text>

                  <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.text }]}>
                    <Text style={[styles.badgeText, { color: colors.text }]}>
                      {emp.role_name || emp.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionGroup}>
                  <Pressable
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                    onPress={() => {
                      if (onSelectEmployee) {
                        onSelectEmployee(emp);
                      }
                    }}
                    hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
                  >
                    <Text style={styles.detailText}>Detaylar</Text>
                  </Pressable>

                  {onEditEmployee && (
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                      onPress={() => onEditEmployee(emp)}
                      hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
                    >
                      <Text style={[styles.editText, { color: colors.button }]}>
                        Güncelle
                      </Text>
                    </Pressable>
                  )}
                </View>

              </View>
            );
          })}
        </View>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    gap: 10,
  },
  emptyText: {
    color: '#777777',
    fontStyle: 'italic',
    textAlign: 'left',
    padding: 10,
    fontSize: 14,
  },
  listContainer: {
    gap: 10,
  },
  employeeCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderLeftWidth: 5, 
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  employeeName: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});