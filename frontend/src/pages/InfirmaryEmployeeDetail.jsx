import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import HealthDetailCard from '../components/molecules/HealthDetailCard';
import Header from '../components/organisms/Header';

function InfirmaryEmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => setEmployee(res.data))
      .catch(err => console.error("Çalışan bilgi hatası:", err));
  }, [id]);

  if (!employee) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Sağlık kayıtları yükleniyor...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',maxWidth: '50%', margin: '40px auto' }}>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>

        <Header
          title="Personel Sağlık Kartı Detayı"
          backgroundColor="#4db6ac" 
          backPath="/infirmary-panel" 
          backButtonText="Geri Dön"
        />

        <HealthDetailCard employee={employee} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
          <Button onClick={() => navigate(`/infirmary/employee/${id}/add-examination`)} style={{ padding: '15px', background: '#70b1ab', fontSize: '16px' }}>
            Yeni Muayene Ekle
          </Button>

          <Button onClick={() => navigate(`/infirmary/employee/${id}/history`)} style={{ padding: '15px', background: '#70b1ab', fontSize: '16px' }}>
            Geçmiş Muayeneleri Gör
          </Button>

          <Button onClick={() => navigate(`/infirmary/employee/${id}/health-certificates`)} style={{ padding: '15px', background: '#70b1ab', fontSize: '16px', gridColumn: '1 / span 2' }}>
            Personel Sağlık Sertifikalarını Yönet
          </Button>
        </div>

      </div>
    </div>
  );
}

export default InfirmaryEmployeeDetail;