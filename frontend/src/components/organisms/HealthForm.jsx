import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import FormTextarea from '../molecules/FormTextarea';
import Button from '../atoms/Button';

function HealthForm({ types, onSubmit, onCancel }) {
  const [certificateTypeId, setCertificateTypeId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ certificateTypeId, issueDate, expiryDate, description });
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Sertifika / Rapor Türü</label>
        <select 
          value={certificateTypeId} 
          onChange={e => setCertificateTypeId(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        >
          <option value="">-- Sağlık Rapor Türü Seçiniz --</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <FormField label="Veriliş Tarihi" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
      <FormField label="Geçerlilik Bitiş Tarihi (Opsiyonel)" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
      
      <FormTextarea 
        label="Rapor / Sertifika Açıklama Notu" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        placeholder="Örn: Ağır ve tehlikeli işlerde çalışabilir sağlık raporu." 
      />

      <div style={{ textAlign:'center', gap: '10px', marginTop: '15px' }}>
        <Button type="submit" style={{ background: '#00796b', flex: 1 }}>Sertifikayı Kaydet</Button>
        
      </div>
    </form>
  );
}

export default HealthForm;