import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WelderForm from '../components/organisms/WelderForm';
import Header from '../components/organisms/Header';
import Button from '../components/atoms/Button';

function QCAddCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/quality_control.php?action=get_types').then(res => setTypes(res.data));
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
        alert(res.data.message);
        navigate(`/qc/employee/${id}`);
      })
      .catch(err => alert('Sertifika kaydedilemedi!'));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',  maxWidth: '50%', margin: '30px auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e18ce7', paddingBottom: '10px' }}>
        <h2 style={{ color: '#e18ce7' }}>
          Yeni Teknik Sertifika Girişi
        </h2>
        <Button onClick={() => navigate(`/qc/employee/${id}`)} style={{ background: '#6c757d' }}>İptal</Button>
      </div>


      <WelderForm
        types={types}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate(`/qc/employee/${id}`)}
      />
    </div>
  );
}

export default QCAddCertificate;