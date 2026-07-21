import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/organisms/LoginForm';

function Login() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (loginData) => {
    setMessage('');

    axios.post('http://localhost/stajERP/backend/login.php', loginData)
      .then(res => {
        if (res.data && res.data.user) {
          const userData = res.data.user;

          localStorage.setItem('employee_id', userData.id);
          localStorage.setItem('system_role', userData.role);
          localStorage.setItem('user', JSON.stringify(userData));

          alert("Giriş başarıyla gerçekleşti! Kontrol merkezine yönlendiriliyorsunuz.");
          navigate('/dashboard-selection');
        }
      })
      .catch(err => {
        console.error("Giriş hatası:", err);

        if (err.response && err.response.data && err.response.data.error) {
          setMessage(err.response.data.error);
        } else {
          setMessage("Giriş yapılırken bir hata oluştu veya sunucuya erişilemedi.");
        }
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#f472e9', marginBottom: '20px' }}>ERP Giriş Paneli</h2>

      <LoginForm 
        onSubmit={handleLogin}
        errorMessage={message}
        onNavigateRegister={() => navigate('/register')}
      />
    </div>
  );
}

export default Login;