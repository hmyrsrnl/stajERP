import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

function LoginForm({ onSubmit, errorMessage, onNavigateRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>
          {errorMessage}
        </p>
      )}

      <FormField 
        label="E-posta" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="ornek@firma.com" 
      />

      <FormField 
        label="Şifre" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="******" 
      />

      <Button type="submit" style={{ background: '#ef4ee1', color: 'white', width: '100%', marginTop: '10px' }}>
        Giriş Yap
      </Button>

      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Hesabınız yok mu?{' '}
        <span 
          onClick={onNavigateRegister} 
          style={{ color: '#f472e9', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Yeni Kayıt Oluştur
        </span>
      </p>
    </form>
  );
}

export default LoginForm;