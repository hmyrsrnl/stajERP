import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import HealthForm from '../components/organisms/HealthForm';

function HealthCertificateAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/health_certificates.php?action=get_types').then(res => setTypes(res.data));
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
        alert(res.data.message);
        navigate(`/infirmary/employee/${id}/health-certificates`);
      })
      .catch(err => alert('Sertifika eklenemedi.'));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #26a69a', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b' }}>
          Yeni Sağlık Raporu / Sertifikası Ekle
        </h2>
        <Button onClick={() => navigate(`/infirmary/employee/${employeeId}/health-certificates`)} style={{ background: '#6c757d' }}>İptal</Button>
      </div>

      <HealthForm
        types={types}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate(`/infirmary/employee/${id}/health-certificates`)}
      />
    </div>
  );
}

export default HealthCertificateAdd;