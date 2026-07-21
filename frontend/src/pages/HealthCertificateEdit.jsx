import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import HealthForm from '../components/organisms/HealthForm';

function HealthCertificateEdit() {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/health_certificates.php?action=get_types')
      .then(res => setTypes(res.data))
      .catch(err => console.error("Sertifika türleri yüklenemedi:", err));

    axios.get(`http://localhost/stajERP/backend/health_certificates.php?action=get_single&certificate_id=${certificateId}`)
      .then(res => {
        if (res.data) {
          setInitialData(res.data);
          setEmployeeId(res.data.employee_id);
        }
      })
      .catch(err => console.error("Sertifika detayı getirilemedi:", err));
  }, [certificateId]);

  const handleUpdate = (formData) => {
    const data = {
      certificate_type_id: formData.certificateTypeId,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate === '' ? null : formData.expiryDate,
      description: formData.description
    };

    axios.post(`http://localhost/stajERP/backend/health_certificates.php?action=update&certificate_id=${certificateId}`, data)
      .then(res => {
        alert(res.data.message || 'Sağlık sertifikası güncellendi.');
        navigate(`/infirmary/employee/${employeeId}/health-certificates`);
      })
      .catch(err => {
        console.error("Güncelleme hatası:", err);
        alert('Güncelleme başarısız.');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title="Sağlık Sertifikası Düzenleme"
        backgroundColor="#00796b"
        backPath={`/infirmary/employee/${employeeId}/health-certificates`}
        backButtonText="İptal"
      />

      {initialData ? (
        <div style={{ marginTop: '20px' }}>
          <HealthForm
            types={types}
            initialData={initialData}
            onSubmit={handleUpdate}
            submitButtonText="Değişiklikleri Kaydet"
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Sertifika bilgileri yükleniyor...
        </div>
      )}

    </div>
  );
}

export default HealthCertificateEdit;