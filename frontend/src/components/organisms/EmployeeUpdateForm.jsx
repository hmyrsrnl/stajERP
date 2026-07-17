import React, { useState, useEffect } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

function EmployeeUpdateForm({ initialData, departments, onSubmit }) {
  const [formData, setFormData] = useState({
    tc_no: '', first_name: '', last_name: '', email: '',
    phone_number: '', home_address: '', role_name: '',
    maas: '', system_role: 'calısan', department_id: '', status: 'Aktif'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      <FormField label="T.C. Kimlik No" value={formData.tc_no} onChange={e => handleChange('tc_no', e.target.value)} />
      <FormField label="Ad" value={formData.first_name} onChange={e => handleChange('first_name', e.target.value)} />
      <FormField label="Soyad" value={formData.last_name} onChange={e => handleChange('last_name', e.target.value)} />
      <FormField label="Telefon" value={formData.phone_number} onChange={e => handleChange('phone_number', e.target.value)} />
      <FormField label="E-posta" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
      <FormField label="Adres" value={formData.home_address} onChange={e => handleChange('home_address', e.target.value)} />
      <FormField label="Şirket İçi Ünvan" value={formData.role_name} onChange={e => handleChange('role_name', e.target.value)} />
      <FormField label="Maaş" type="number" value={formData.maas} onChange={e => handleChange('maas', e.target.value)} />

      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Departman</label>
        <select value={formData.department_id || ''} onChange={e => handleChange('department_id', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">-- Departman Yok --</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.department_name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Sistem Rolü</label>
        <select value={formData.system_role} onChange={e => handleChange('system_role', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="calısan">Düz Çalışan</option>
          <option value="ik">İnsan Kaynakları</option>
          <option value="revir">Sağlık İşleri</option>
          <option value="kk">Kalite Kontrol</option>
        </select>
      </div>

      <div style={{ marginBottom: '25px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Çalışan Durumu</label>
        <select value={formData.status} onChange={e => handleChange('status', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="Aktif">Aktif</option>
          <option value="Pasif">Pasif</option>
        </select>
      </div>

      <div style={{textAlign: 'center'}}>     
      <Button type="submit" style ={{background: '#f7a33c'}}>Bilgileri Güncelle</Button>
      </div>  
    </form>
  );
}

export default EmployeeUpdateForm;