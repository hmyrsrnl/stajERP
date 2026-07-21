import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import HealthForm from '../components/organisms/HealthForm';

function HealthCertificateAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/health_certificates.php?action=get_types')
      .then(res => setTypes(res.data))
      .catch(err => console.error("Sertifika türleri yüklenemedi:", err));
  }, []);

  const handleFormSubmit = (formData) => {
    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      alert("Hata: Geçerlilik bitiş tarihi, veriliş tarihinden sonraki bir tarih olmalıdır!");
      return;
    }

    const data = {
      employee_id: id,
      certificate_type_id: formData.certificateTypeId,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate,
      description: formData.description,
      level: 'Sağlık Onaylı'
    };

    axios.post('http://localhost/stajERP/backend/health_certificates.php?action=add', data)
      .then(res => {
        alert(res.data.message || 'Sağlık sertifikası başarıyla eklendi.');
        navigate(`/infirmary/employee/${id}/health-certificates`);
      })
      .catch(err => {
        console.error("Sertifika ekleme hatası:", err);
        alert('Sertifika eklenemedi.');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title="Yeni Sağlık Raporu / Sertifikası Ekle"
        backgroundColor="#00796b"
        backPath={`/infirmary/employee/${id}/health-certificates`}
        backButtonText="İptal"
      />

      <div style={{ marginTop: '20px' }}>
        <HealthForm
          types={types}
          onSubmit={handleFormSubmit}
          onCancel={() => navigate(`/infirmary/employee/${id}/health-certificates`)}
        />
      </div>

    </div>
  );
}

export default HealthCertificateAdd;