import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import WelderForm from '../components/organisms/WelderForm';

function QCAddCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/quality_control.php?action=get_types')
      .then(res => setTypes(res.data))
      .catch(err => console.error("Sertifika türleri çekilemedi:", err));
  }, []);

  const handleFormSubmit = (formData) => {
    if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      alert("Hata: Sertifika bitiş tarihi, veriliş tarihinden sonra olmalıdır!");
      return;
    }

    const certificateData = {
      employee_id: id,
      certificate_type_id: formData.certificateTypeId,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate,
      level: formData.level,
      status: 'Aktif'
    };

    axios.post('http://localhost/stajERP/backend/quality_control.php?action=add', certificateData)
      .then(res => {
        alert(res.data.message || "Teknik sertifika başarıyla eklendi.");
        navigate(`/qc/employee/${id}`);
      })
      .catch(err => {
        console.error("Sertifika kaydetme hatası:", err);
        alert('Sertifika kaydedilemedi!');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>

      <Header
        title="Yeni Teknik Sertifika Girişi"
        backgroundColor="#e18ce7"
        backPath={`/qc/employee/${id}`}
        backButtonText="İptal"
      />

      <div style={{ marginTop: '20px' }}>
        <WelderForm
          types={types}
          onSubmit={handleFormSubmit}
          onCancel={() => navigate(`/qc/employee/${id}`)}
        />
      </div>

    </div>
  );
}

export default QCAddCertificate;