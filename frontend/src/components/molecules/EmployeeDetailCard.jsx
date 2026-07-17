import React from 'react';
import Button from '../atoms/Button';

function EmployeeDetailCard({ employee, onClose , onEditClick ,ondeleteClick}) {
  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Girilmedi';
    const date = new Date(dateString);
    return date.toString() === 'Invalid Date' ? 'Geçersiz Tarih' : date.toLocaleDateString('tr-TR');
  };

  return (
    <div style={{ flex: '1', background: '#fff', border: '2px solid #f7a33c', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
    
      <p><strong>Ad Soyad:</strong> {employee.first_name} {employee.last_name}</p>
      <p><strong>T.C. No:</strong> {employee.tc_no}</p>
      <p><strong>Görev:</strong> {employee.role_name}</p>
      <p><strong>Durum:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{employee.status || 'Aktif'}</span></p>
      <p><strong>Oluşturulma Tarihi:</strong> {formatDate(employee.created_at)}</p>
      <p><strong>Güncellenme Tarihi:</strong> {formatDate(employee.updated_at)}</p>
      
      <p><strong>E-posta:</strong> {employee.email || employee.email_address || 'Girilmedi'}</p>
      <p><strong>Telefon:</strong> {employee.phone_number || employee.phone || 'Girilmedi'}</p>
      <p><strong>Ev Adresi:</strong> {employee.home_address || employee.address || 'Girilmedi'}</p>

    </div>
  );
}

export default EmployeeDetailCard;