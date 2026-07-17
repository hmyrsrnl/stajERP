import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/organisms/Header';
import ExaminationTable from '../components/organisms/ExaminationTable'; 

function EmployeeExaminations() {
  const [examinations, setExaminations] = useState([]);
  const employeeId = localStorage.getItem('employee_id') || 1;

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/infirmary.php?action=employee_history&employee_id=${employeeId}`)
      .then(res => setExaminations(res.data))
      .catch(err => console.error("Muayene geçmişi yüklenemedi:", err));
  }, [employeeId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',maxWidth: '50%', margin: '20px auto', maxWidth: '900px'}}>
      
      <Header 
        title="Sağlık Muayene Geçmişim" 
        backgroundColor="#2b5876" 
        backPath="/employee-dashboard"
        backButtonText="Geri Dön"
      />

      <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        <ExaminationTable 
          examinations={examinations} 
          isReadOnly={true} 
        />
      </div>
    </div>
  );
}

export default EmployeeExaminations;