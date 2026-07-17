import React from 'react';

function QCDetailCard({ welder }) {
  if (!welder) return null;

  return (
    <div style={{ background: '#f3e5f5', padding: '15px 20px', borderRadius: '8px', border: '1px solid #e1bee7', marginBottom: '25px', textAlign: 'left' }}>
      <p style={{ margin: '4px 0' }}><strong>Personel Adı Soyadı:</strong> {welder.first_name} {welder.last_name}</p>
      <p style={{ margin: '4px 0' }}><strong>Unvan / Görev:</strong> <span style={{ color: '#6a1b9a', fontWeight: 'bold' }}>{welder.role_name}</span></p>
      <p style={{ margin: '4px 0' }}><strong>E-posta:</strong> {welder.email}</p>
    </div>
  );
}

export default QCDetailCard;