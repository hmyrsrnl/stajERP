import React, { useState, useEffect } from 'react';
import FormField from '../molecules/FormField';
import FormTextarea from '../molecules/FormTextarea';
import Button from '../atoms/Button';

function HealthForm({ types = [], initialData = {}, onSubmit, submitButtonText = "Kaydet" }) {
  const [certificateTypeId, setCertificateTypeId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData.certificate_type_id) setCertificateTypeId(initialData.certificate_type_id);
    if (initialData.issue_date) setIssueDate(initialData.issue_date);
    if (initialData.expiry_date !== undefined) setExpiryDate(initialData.expiry_date || '');
    if (initialData.description !== undefined) setDescription(initialData.description || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      certificateTypeId,
      issueDate,
      expiryDate,
      description
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      
      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
          Sertifika / Rapor Türü
        </label>
        <select 
          value={certificateTypeId} 
          onChange={e => setCertificateTypeId(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Seçiniz...</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <FormField 
        label="Veriliş Tarihi" 
        type="date" 
        value={issueDate} 
        onChange={e => setIssueDate(e.target.value)} 
      />

      <FormField 
        label="Geçerlilik Bitiş Tarihi" 
        type="date" 
        value={expiryDate} 
        onChange={e => setExpiryDate(e.target.value)} 
      />

      <FormTextarea 
        label="Rapor Açıklama Notu" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
      />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="submit" style={{ background: '#00796b', width: '100%', color: 'white' }}>
          {submitButtonText}
        </Button>
      </div>

    </form>
  );
}

export default HealthForm;