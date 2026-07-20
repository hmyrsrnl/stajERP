import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExaminationTable from '../components/organisms/ExaminationTable';
import Button from '../components/atoms/Button';

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
      .catch(err => console.error(err));

    fetchExaminations();
  }, [id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #4db6ac', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b' }}>
          Muayene Geçmişi <span style={{ color: '#555', fontSize: '16px' }}>({employeeName})</span>
        </h2>
        <Button onClick={() => navigate(`/infirmary/employee/${id}`)} style={{ background: '#6c757d' }}>
          Geri Dön
        </Button>
      </div>

      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        
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