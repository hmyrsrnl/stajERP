import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import ExaminationTable from '../components/organisms/ExaminationTable';

function ExaminationHistory() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  const fetchExaminations = () => {
    axios.get(`http://localhost/stajERP/backend/infirmary.php?action=list&employee_id=${id}`)
      .then(res => setExaminations(res.data))
      .catch(err => console.error("Muayene geçmişi yüklenemedi:", err));
  };

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => setEmployeeName(`${res.data.first_name} ${res.data.last_name}`))
      .catch(err => console.error("Çalışan detay hatası:", err));

    fetchExaminations();
  }, [id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title={`Muayene Geçmişi ${employeeName ? `(${employeeName})` : ''}`}
        backgroundColor="#00796b"
        backPath={`/infirmary/employee/${id}`}
        backButtonText="Geri Dön"
      />
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px' }}>
        <ExaminationTable 
          examinations={examinations} 
          onEditClick={(examId) => navigate(`/infirmary/examination/edit/${examId}`)} 
          onDeleteSuccess={fetchExaminations} 
        />
      </div>

    </div>
  );
}

export default ExaminationHistory;