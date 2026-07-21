import React, { useState } from 'react';
import Pagination from '../molecules/Pagination'; 

const departmentColors = {
  'İnsan Kaynakları': { bg: '#fdf4e9', text: '#d97706', button: '#f7a33c' },
  'Revir': { bg: '#fdf2f2', text: '#e02424', button: '#924697' },
  'Kalite Kontrol': { bg: '#f3e8ff', text: '#7e22ce', button: '#db7ae8' },
  'worker': { bg: '#f0fdf4', text: '#15803d', button: '#22c55e' }
};

const defaultColor = { bg: '#f3f4f6', text: '#4b5563', button: '#c81919' };

function EmployeeTable({ employees, onSelectEmployee, onEditEmployee, allEmployeesLength }) {
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {currentEmployees.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', textAlign: 'left', padding: '10px', margin: 0 }}>
          {allEmployeesLength === 0 ? 'Henüz kayıtlı çalışan yok.' : 'Aradığınız kriterlere uygun çalışan bulunamadı.'}
        </p>
      ) : (
        currentEmployees.map(emp => {
          const colors = departmentColors[emp.role_name] || departmentColors[emp.role] || defaultColor;

          return (
            <div 
              key={emp.id} 
              style={{ 
                padding: '14px 20px', 
                background: 'white', 
                border: '1px solid #dee2e6',
                borderLeft: `5px solid ${colors.text}`, 
                borderRadius: '6px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <strong style={{ color: '#000000', fontSize: '15px' }}>
                  {emp.first_name} {emp.last_name}
                </strong> 
                
                <span style={{ 
                  padding: '3px 8px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  background: colors.bg, 
                  color: colors.text,
                  border: `1px solid ${colors.text}`,
                  whiteSpace: 'nowrap'
                }}>
                  {emp.role_name}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <span 
                  onClick={() => onSelectEmployee(emp)} 
                  style={{ color: '#007bff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Detaylar
                </span>
                {onEditEmployee && (
                  <span 
                    onClick={() => onEditEmployee(emp)} 
                    style={{ color: colors.button, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Güncelle
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />

    </div>
  );
}

export default EmployeeTable;