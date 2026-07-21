import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import ExaminationForm from '../components/organisms/ExaminationForm';

function ExaminationEdit() {
  const { examinationId } = useParams(); 
  const navigate = useNavigate();

  const [examData, setExamData] = useState(null);
  const [employeeId, setEmployeeId] = useState(''); 

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/infirmary.php?action=get_single&examination_id=${examinationId}`)
      .then(res => {
        if (res.data) {
          setExamData(res.data);
          setEmployeeId(res.data.employee_id);
        }
      })
      .catch(err => console.error("Muayene detayı getirilemedi:", err));
  }, [examinationId]);

  const handleUpdate = (updatedFormData) => {
    axios.post(`http://localhost/stajERP/backend/infirmary.php?action=update&examination_id=${examinationId}`, updatedFormData)
      .then(res => {
        alert(res.data.message || "Muayene kaydı başarıyla güncellendi.");
        navigate(`/infirmary/employee/${employeeId}/history`); 
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Güncelleme sırasında bir hata oluştu!');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title="Muayene Kaydı Düzenleme"
        backgroundColor="#00796b"
        backPath={`/infirmary/employee/${employeeId}/history`}
        backButtonText="Geri Dön"
      />

      {examData ? (
        <div style={{ marginTop: '20px' }}>
          <ExaminationForm 
            initialData={examData} 
            onSubmit={handleUpdate} 
            submitButtonText="Değişiklikleri Kaydet"
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Muayene bilgileri yükleniyor...
        </div>
      )}

    </div>
  );
}

export default ExaminationEdit;