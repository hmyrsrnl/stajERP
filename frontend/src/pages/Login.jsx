import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');

    const loginData = { email, password };


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
      <h2 style={{ color: '#f472e9' }} >ERP Giriş Paneli</h2>
      {message && <p style={{ color: 'red', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>{message}</p>}
      <form onSubmit={handleLogin}>
        <FormField label="E-posta" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@firma.com" />
        <FormField label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="******" />
        <Button type="submit" style={{ background: '#ef4ee1', color: 'white' }}>
          Giriş Yap</Button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Hesabınız yok mu? <span onClick={() => navigate('/register')} style={{ color: '#f472e9', cursor: 'pointer', textDecoration: 'underline' }}>Yeni Kayıt Oluştur</span>
      </p>
    </div>
  );
}

export default Login;