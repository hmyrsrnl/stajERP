import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/organisms/Header';
import EmployeeCertificateTable from '../components/organisms/EmployeeCertificateTable';

function EmployeeCertificates() {
  const [certificates, setCertificates] = useState([]);
  const employeeId = localStorage.getItem('employee_id') || 1;

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/quality_control.php?action=list&employee_id=${employeeId}`)
      .then(res => setCertificates(res.data))
      .catch(err => console.error("Sertifikalar yüklenirken hata oluştu:", err));
  }, [employeeId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '20px auto' }}>
      
      <Header 
        title="Sertifika ve Mesleki Yeterliliklerim" 
        backgroundColor="#2b5876" 
        backPath="/employee-dashboard"
        backButtonText="Geri Dön"
      />

      <EmployeeCertificateTable certificates={certificates} />
      
    </div>
  );
}

export default EmployeeCertificates;