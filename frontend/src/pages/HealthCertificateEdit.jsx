import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormField from '../components/molecules/FormField';
import FormTextarea from '../components/molecules/FormTextarea';
import Button from '../components/atoms/Button';

function HealthCertificateEdit() {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [certificateTypeId, setCertificateTypeId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/health_certificates.php?action=get_types').then(res => setTypes(res.data));

    axios.get(`http://localhost/stajERP/backend/health_certificates.php?action=get_single&certificate_id=${certificateId}`)
      .then(res => {
        if (res.data) {
          setCertificateTypeId(res.data.certificate_type_id);
          setIssueDate(res.data.issue_date);
          setExpiryDate(res.data.expiry_date || '');
          setDescription(res.data.description || '');
          setEmployeeId(res.data.employee_id);
        }
      });
  }, [certificateId]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = { certificate_type_id: certificateTypeId, issue_date: issueDate, expiry_date: expiryDate === '' ? null : expiryDate, description };

    axios.post(`http://localhost/stajERP/backend/health_certificates.php?action=update&certificate_id=${certificateId}`, data)
      .then(res => {
        alert(res.data.message);
        navigate(`/infirmary/employee/${employeeId}/health-certificates`);
      })
      .catch(err => alert('Güncelleme başarısız.'));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #26a69a', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b' }}>Sağlık Sertifikası Düzenleme</h2>
        <Button onClick={() => navigate(`/infirmary/employee/${employeeId}/health-certificates`)} style={{ background: '#6c757d' }}>İptal</Button>
      </div>

      <form onSubmit={handleUpdate} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Sertifika / Rapor Türü</label>
          <select value={certificateTypeId} onChange={e => setCertificateTypeId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <FormField label="Veriliş Tarihi" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
        <FormField label="Geçerlilik Bitiş Tarihi" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
        <FormTextarea label="Rapor Açıklama Notu" value={description} onChange={e => setDescription(e.target.value)} />

        <Button type="submit" style={{ background: '#00796b', width: '100%' }}>Değişiklikleri Kaydet</Button>
      </form>
    </div>
  );
}

export default HealthCertificateEdit;