import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WelderForm from '../components/organisms/WelderForm';
import Header from '../components/organisms/Header';
import Button from '../components/atoms/Button';

function QCEditCertificate() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [currentCert, setCurrentCert] = useState(null);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/quality_control.php?action=get_types').then(res => setTypes(res.data));

    axios.get(`http://localhost/stajERP/backend/quality_control.php?action=get_single&certificate_id=${certificateId}`)
      .then(res => {
        if (res.data) setCurrentCert(res.data);
      })
      .catch(err => console.error("Sertifika detayı getirilemedi:", err));
  }, [certificateId]);

  const handleFormUpdate = (formData) => {
    if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      alert("Hata: Sertifika bitiş tarihi, veriliş tarihinden sonra olmalıdır!");
      return;
    }

    const updatedData = {
      certificate_type_id: formData.certificateTypeId,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate,
      level: formData.level
    };

    axios.post(`http://localhost/stajERP/backend/quality_control.php?action=update&certificate_id=${certificateId}`, updatedData)
      .then(res => {
        alert(res.data.message);
        navigate(`/qc/employee/${currentCert.employee_id}`); 
      })
      .catch(err => alert('Güncelleme sırasında bir hata oluştu!'));
  };

  if (!currentCert) return <div style={{ padding: '20px', textAlign: 'center' }}>Sertifika bilgileri yükleniyor...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',  maxWidth: '50%', margin: '30px auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e18ce7', paddingBottom: '10px' }}>
        <h2 style={{ color: '#e18ce7' }}>
          Kaynakçı Sertifikası Düzenleme
        </h2>
        <Button onClick={() => navigate(`/qc/employee/${currentCert.employee_id}`)} style={{ background: '#6c757d' }}>İptal</Button>
      </div>

      <WelderForm 
        types={types} 
        initialData={currentCert} 
        onSubmit={handleFormUpdate} 
        onCancel={() => navigate(`/qc/employee/${currentCert.employee_id}`)} 
      />
    </div>
  );
}

export default QCEditCertificate;