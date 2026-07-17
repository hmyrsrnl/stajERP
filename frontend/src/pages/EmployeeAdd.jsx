import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import EmployeeForm from '../components/organisms/EmployeeForm';

function EmployeeAdd() {
  const navigate = useNavigate();

  const handleSaveSuccess = () => {
    alert("Çalışan başarıyla sisteme eklendi!");
    navigate('/hr-panel');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #de8e47', paddingBottom: '10px' }}>
        <h2 style={{ color: '#de8e47', margin: 0 }}>Yeni Çalışan Ekleme Formu</h2>
        <Button 
          onClick={() => navigate('/hr-panel')} 
          style={{ padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}
        > Geri Dön
        </Button>
      </div>

      <EmployeeForm onSaveSuccess={handleSaveSuccess} />

    </div>
  );
}

export default EmployeeAdd;