import React from 'react';
import Button from '../atoms/Button';

function EmployeeNavActions({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
      <Button
        onClick={() => onNavigate('/employee/change-password')}
        style={{ padding: '18px', background: '#5484a4', fontSize: '16px', borderRadius: '8px', color: 'white' }}
      >
        Şifremi Değiştir
      </Button>

      <Button
        onClick={() => onNavigate('/employee/requests')}
        style={{ padding: '18px', background: '#5484a4', fontSize: '16px', borderRadius: '8px', color: 'white' }}
      >
        Departman Taleplerinde Bulun
      </Button>

      <Button
        onClick={() => onNavigate('/employee/examinations')}
        style={{ padding: '18px', background: '#5e93b7', fontSize: '16px', borderRadius: '8px', color: 'white' }}
      >
        Geçmiş Muayeneleri Gör
      </Button>

      <Button
        onClick={() => onNavigate('/employee/certificates')}
        style={{ padding: '18px', background: '#669fc5', fontSize: '16px', borderRadius: '8px', color: 'white' }}
      >
        Sertifikalarımı Görüntüle
      </Button>
    </div>
  );
}

export default EmployeeNavActions;