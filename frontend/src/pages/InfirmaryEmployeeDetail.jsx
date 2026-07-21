import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import HealthDetailCard from '../components/molecules/HealthDetailCard';
import InfirmaryActions from '../components/organisms/InfirmaryActions';

function InfirmaryEmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => setEmployee(res.data))
      .catch(err => console.error("Çalışan bilgi hatası:", err));
  }, [id]);

  if (!employee) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontFamily: 'Arial, sans-serif' }}>
        Sağlık kayıtları yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '40px auto' }}>
      
      <Header
        title="Personel Sağlık Kartı Detayı"
        backgroundColor="#4db6ac" 
        backPath="/infirmary-panel" 
        backButtonText="Geri Dön"
      />

      <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '20px' }}>
        
        <HealthDetailCard employee={employee} />

        <InfirmaryActions employeeId={id} />

      </div>
    </div>
  );
}

export default InfirmaryEmployeeDetail;