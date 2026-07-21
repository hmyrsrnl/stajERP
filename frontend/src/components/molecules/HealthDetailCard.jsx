import React from 'react';

function HealthDetailCard({ employee }) {
  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Girilmedi';
    const date = new Date(dateString);
    return date.toString() === 'Invalid Date' ? 'Geçersiz Tarih' : date.toLocaleDateString('tr-TR');
  };

  return (
    <div style={{ background: '#dff9f6', padding: '15px 20px', borderRadius: '8px', border: '1px solid #e1bee7', marginBottom: '25px', textAlign: 'left' }}>
      <h2 style={{ color: '#004c43', marginTop: '0', marginBottom: '15px' }}>Personel Sağlık Kimlik Bilgileri</h2>
      <p style={{ margin: '5px 0' }}><strong>Adı Soyadı:</strong> {employee.first_name} {employee.last_name}</p>
      <p style={{ margin: '5px 0' }}><strong>T.C. Kimlik No:</strong> {employee.tc_no}</p>
      <p style={{ margin: '5px 0' }}><strong>Departman / Unvan:</strong> {employee.department_name} / {employee.role_name}</p>
      <p style={{ margin: '5px 0' }}><strong>İletişim Numarası:</strong> {employee.phone_number}</p>
      <p style={{ margin: '5px 0' }}><strong>Kurumsal E-posta:</strong> {employee.email}</p>
      
      <p style={{ margin: '5px 0' }}><strong>İşe Başlangıç Tarihi:</strong> {formatDate(employee.hire_date || employee.created_at)}</p>
    </div>
  );
}

export default HealthDetailCard;