import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import ChangePasswordForm from '../components/organisms/ChangePasswordForm';

function ChangePassword() {
  const navigate = useNavigate();
  const employeeId = localStorage.getItem('employee_id');

  if (!employeeId || employeeId === "null") {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yetkisiz Giriş! Lütfen önce oturum açın.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '40px auto' }}>
      <Header
        title="Güvenlik Ayarları"
        backgroundColor="#2b5876"
        backPath="/employee-dashboard" 
        backButtonText="Geri Dön"
      />
      
      <div style={{ marginTop: '20px' }}>
        <ChangePasswordForm employeeId={employeeId} />
      </div>
    </div>
  );
}

export default ChangePassword;