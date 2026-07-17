import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import Button from '../components/atoms/Button';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const employeeId = localStorage.getItem('employee_id');

  useEffect(() => {
    if (!employeeId || employeeId === "null") {
      alert("Lütfen önce sisteme giriş yapın!");
      navigate('/');
      return;
    }

    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${employeeId}`)
      .then(res => {
        if (res.data) {
          setEmployeeInfo(res.data);
        }
      })
      .catch(err => {
        console.error("Çalışan bilgisi çekilemedi:", err);
        alert("Oturum bilgileri doğrulanırken bir hata oluştu!");
      });
  }, [employeeId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('employee_id');
    localStorage.removeItem('user'); 
    navigate('/');
  };

  if (!employeeInfo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        Oturumunuz kontrol ediliyor...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '20px auto' }}>

      <Header
        title={`Hoş Geldiniz, ${employeeInfo.first_name} ${employeeInfo.last_name}`}
        backgroundColor="#2b5876"
        backPath="/"
        backButtonText="Çıkış Yap"
        onClick={handleLogout}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

        <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>
          <h3 style={{ borderBottom: '2px solid #2b5876', paddingBottom: '8px', color: '#2b5876' }}>Profil Bilgilerim</h3>
          <p style={{ margin: '10px 0' }}><strong>Ad Soyad:</strong> {employeeInfo.first_name} {employeeInfo.last_name}</p>
          <p style={{ margin: '10px 0' }}><strong>E-posta:</strong> {employeeInfo.email}</p>
          <p style={{ margin: '10px 0' }}><strong>Görev / Unvan:</strong> {employeeInfo.role_name}</p>
          <p style={{ margin: '10px 0' }}><strong>Telefon Numarası:</strong> {employeeInfo.phone_number}</p>
          <p style={{ margin: '10px 0' }}><strong>Adres:</strong> {employeeInfo.home_address}</p>
          <p style={{ margin: '10px 0' }}><strong>İş Durumu:</strong>
            <span style={{ marginLeft: '5px', padding: '2px 8px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
              {employeeInfo.status || 'Aktif'}
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>

          <Button
            onClick={() => navigate('/employee/change-password')}
            style={{ padding: '18px', background: '#5484a4', fontSize: '16px', borderRadius: '8px' }}
          >
            Şifremi Değiştir
          </Button>

          <Button
            onClick={() => navigate('/employee/requests')}
            style={{ padding: '18px', background: '#5484a4', fontSize: '16px', borderRadius: '8px' }}
          >
            Departman Taleplerinde Bulun
          </Button>

          <Button
            onClick={() => navigate('/employee/examinations')}
            style={{ padding: '18px', background: '#5e93b7', fontSize: '16px', borderRadius: '8px' }}
          >
            Geçmiş Muayeneleri Gör
          </Button>

          <Button
            onClick={() => navigate('/employee/certificates')}
            style={{ padding: '18px', background: '#669fc5', fontSize: '16px', borderRadius: '8px' }}
          >
            Sertifikalarımı Görüntüle
          </Button>
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;