import React, { useState } from 'react';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';

function RegisterForm({ onSubmit }) {
  const [tc_no, setTcNo] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  //const [home_address, setHomeAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      tc_no,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      //home_address
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="T.C. Kimlik No" value={tc_no} onChange={e => setTcNo(e.target.value)} placeholder="T.C. Kimlik Numaranız" required />
      <FormField label="Ad" value={first_name} onChange={e => setFirstName(e.target.value)} placeholder="Adınız" required />
      <FormField label="Soyad" value={last_name} onChange={e => setLastName(e.target.value)} placeholder="Soyadınız" required />
      <FormField label="Telefon Numarası" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} placeholder="05xx xxx xx xx" required />
      {/*<FormField label="Adres" value={home_address} onChange={e => setHomeAddress(e.target.value)} placeholder="Ev Adresiniz" required />*/}
      <FormField label="E-posta" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@firma.com" required />
      <FormField label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="******" required />

      <div style={{ marginTop: '20px', background: '#ef4ee1', borderRadius: '4px' }}>
        <Button type="submit" style={{ background: '#ef4ee1', width: '100%', padding: '10px' }}>
          Kayıt Ol
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;