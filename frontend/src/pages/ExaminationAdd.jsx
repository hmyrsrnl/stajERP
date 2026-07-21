import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import ExaminationForm from '../components/organisms/ExaminationForm';

function ExaminationAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleFormSubmit = (formData) => {
    const examinationData = {
      employee_id: id,
      doctor_id: 2,
      ...formData
    };

    axios.post(`http://localhost/stajERP/backend/infirmary.php?action=add`, examinationData)
      .then(res => {
        alert(res.data.message || 'Muayene kaydı başarıyla eklendi.');
        navigate(`/infirmary/employee/${id}`);
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Muayene kaydı eklenirken bir hata oluştu!');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title="Yeni Muayene Girişi"
        backgroundColor="#00796b"
        backPath={`/infirmary/employee/${id}`}
        backButtonText="İptal Et"
      />

      <div style={{ marginTop: '20px' }}>
        <ExaminationForm onSubmit={handleFormSubmit} />
      </div>

    </div>
  );
}

export default ExaminationAdd;