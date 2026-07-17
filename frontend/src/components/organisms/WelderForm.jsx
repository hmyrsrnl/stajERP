import React, { useState, useEffect } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

function WelderForm({ types, onSubmit, onCancel, initialData }) {
  const [certificateTypeId, setCertificateTypeId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    if (initialData) {
      setCertificateTypeId(initialData.certificate_type_id || '');
      setIssueDate(initialData.issue_date || '');
      setExpiryDate(initialData.expiry_date || '');
      setLevel(initialData.level || '');
    }
  }, [initialData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ certificateTypeId, issueDate, expiryDate, level });
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
          Sertifika Tanımı / Adı
        </label>
        <select 
          value={certificateTypeId} 
          onChange={e => setCertificateTypeId(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontWeight: '500' }}
          required
        >
          <option value="">-- Sertifika Türü Seçiniz --</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
          ))}
        </select>
      </div>

      <FormField label="Sertifika Seviyesi / Yeterlilik" value={level} onChange={e => setLevel(e.target.value)} />
      <FormField label="Sertifika Veriliş Tarihi" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
      <FormField label="Sertifika Geçerlilik Bitiş Tarihi" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />

      <div style={{ textAlign:'center',  gap: '10px', marginTop: '15px' }}>
        <Button type="submit" style={{ background: '#e18ce7', flex: 1 }}>Değişiklikleri Güncelle</Button>
      </div>
    </form>
  );
}

export default WelderForm;