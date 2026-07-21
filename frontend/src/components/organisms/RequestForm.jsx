import React, { useState } from 'react';
import FormTextarea from '../molecules/FormTextarea';
import Button from '../atoms/Button';

function RequestForm({ onSubmit, departments = [] }) {
  const [departmentId, setDepartmentId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!departmentId) {
      alert("Lütfen bir departman seçiniz!");
      return;
    }
 
    onSubmit({ departmentId, subject, description });
    
    setDepartmentId('');
    setSubject('');
    setDescription('');
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>
      <h3 style={{ marginTop: 0, color: '#2b5876', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
        Yeni Talep Oluştur
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>İlgili Departman</label>
        <select
          value={departmentId}
          onChange={e => setDepartmentId(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        >
          <option value="">-- Departman Seçiniz --</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.department_name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Konu</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Örn: Yıllık İzin Talebi, Muayene Randevusu vb."
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          required
        />
      </div>

      <FormTextarea
        label="Talep Açıklaması"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Talebinizin detaylarını buraya yazınız..."
        required
      />

      <Button type="submit" style={{ background: '#2b5876', width: '100%', marginTop: '10px' }}>
        Gönder
      </Button>
    </form>
  );
}

export default RequestForm;