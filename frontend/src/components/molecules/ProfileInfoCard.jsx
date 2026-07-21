import React from 'react';

function ProfileInfoCard({ employeeInfo }) {
  if (!employeeInfo) return null;

  return (
    <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>
      <h3 style={{ borderBottom: '2px solid #2b5876', paddingBottom: '8px', color: '#2b5876', marginTop: 0 }}>
        Profil Bilgilerim
      </h3>
      <p style={{ margin: '10px 0' }}><strong>Ad Soyad:</strong> {employeeInfo.first_name} {employeeInfo.last_name}</p>
      <p style={{ margin: '10px 0' }}><strong>E-posta:</strong> {employeeInfo.email}</p>
      <p style={{ margin: '10px 0' }}><strong>Görev / Unvan:</strong> {employeeInfo.role_name}</p>
      <p style={{ margin: '10px 0' }}><strong>Telefon Numarası:</strong> {employeeInfo.phone_number}</p>
      <p style={{ margin: '10px 0' }}><strong>Adres:</strong> {employeeInfo.home_address}</p>
      <p style={{ margin: '10px 0' }}>
        <strong>İş Durumu:</strong>
        <span style={{ marginLeft: '5px', padding: '2px 8px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          {employeeInfo.status || 'Aktif'}
        </span>
      </p>
    </div>
  );
}

export default ProfileInfoCard;