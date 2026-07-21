import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

function InfirmaryActions({ employeeId }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
      <Button 
        onClick={() => navigate(`/infirmary/employee/${employeeId}/add-examination`)} 
        style={{ padding: '15px', background: '#70b1ab', fontSize: '16px', color: 'white' }}
      >
        Yeni Muayene Ekle
      </Button>

      <Button 
        onClick={() => navigate(`/infirmary/employee/${employeeId}/history`)} 
        style={{ padding: '15px', background: '#70b1ab', fontSize: '16px', color: 'white' }}
      >
        Geçmiş Muayeneleri Gör
      </Button>

      <Button 
        onClick={() => navigate(`/infirmary/employee/${employeeId}/health-certificates`)} 
        style={{ padding: '15px', background: '#70b1ab', fontSize: '16px', gridColumn: '1 / span 2', color: 'white' }}
      >
        Personel Sağlık Sertifikalarını Yönet
      </Button>
    </div>
  );
}

export default InfirmaryActions;