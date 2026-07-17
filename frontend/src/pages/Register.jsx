import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RegisterForm from '../components/organisms/RegisterForm';

function Register() {
  const navigate = useNavigate();

  const handleRegisterSubmit = (registerData) => {
    axios.post('http://localhost/stajERP/backend/register.php', registerData)
      .then(res => {
        alert(res.data.message); 
        navigate('/'); 
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Kayıt sırasında bir hata oluştu!');
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', fontFamily: 'Arial', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '20px', color: '#f472e9' }}>Personel Kayıt Paneli</h2>
      
      <RegisterForm onSubmit={handleRegisterSubmit} />
      
      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Zaten hesabınız var mı?{' '}
        <span onClick={() => navigate('/')} style={{ color: '#f472e9', cursor: 'pointer', textDecoration: 'underline' }}>
          Giriş Yapın
        </span>
      </p>
    </div>
  );
}

export default Register;