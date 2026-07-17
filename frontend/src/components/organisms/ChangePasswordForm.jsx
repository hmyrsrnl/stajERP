import React, { useState } from 'react';
import axios from 'axios';
import Button from '../atoms/Button';

function ChangePasswordForm({ employeeId }) {
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwords.new_password !== passwords.confirm_password) {
      setError("Yeni şifreler uyuşmuyor!");
      return;
    }

    axios.post('http://localhost/stajERP/backend/change_password.php', {
      employee_id: employeeId,
      old_password: passwords.old_password,
      new_password: passwords.new_password
    })
      .then(res => {
        setMessage(res.data.message);
        setPasswords({ old_password: '', new_password: '', confirm_password: '' });
      })
      .catch(err => {
        setError(err.response?.data?.error || "Şifre güncellenirken bir hata oluştu.");
      });
  };

  return (
    <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', maxWidth: '450px', margin: '20px auto', textAlign: 'left' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #2b5876', paddingBottom: '8px' }}>Şifre Değiştir</h2>

      {message && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '15px' }}> {message}</div>}
      {error && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '15px' }}> {error}</div>}

      <form onSubmit={handlePasswordSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Mevcut Şifre</label>
          <input
            type="password"
            value={passwords.old_password}
            onChange={e => handleChange('old_password', e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Yeni Şifre</label>
          <input
            type="password"
            value={passwords.new_password}
            onChange={e => handleChange('new_password', e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            value={passwords.confirm_password}
            onChange={e => handleChange('confirm_password', e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="submit"
            style={{ padding: '10px', background: '#2b5876', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Şifreyi Güncelle
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordForm;