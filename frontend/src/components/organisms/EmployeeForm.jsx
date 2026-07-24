import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

function EmployeeForm({ onSaveSuccess }) {
  const [tcNo, setTcNo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [roleName, setRoleName] = useState('');
  const [maas, setMaas] = useState('');
  const [systemRole, setSystemRole] = useState('calısan');
  const [departmentId, setDepartmentId] = useState('');

  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/departments.php')
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Departmanlar yüklenemedi:", err));
  }, []);

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    setMessage('');

    const employeeData = {
      tc_no: tcNo,
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      email,
      phone_number: phone,
      home_address: homeAddress,
      role_name: roleName,
      maas,
      system_role: systemRole,
      department_id: departmentId === "" ? null : departmentId
    };

    axios.post('http://localhost/stajERP/backend/employees.php', employeeData)
      .then(res => {
        setMessage(res.data.message);
        setTcNo('');
        setFirstName('');
        setLastName('');
        setGender('');
        setEmail('');
        setPhone('');
        setHomeAddress('');
        setRoleName('');
        setMaas('');
        setSystemRole('calısan');
        setDepartmentId('');

        if (onSaveSuccess) onSaveSuccess();
      })
      .catch(err => {
        console.error("Hata Detayı:", err.response?.data);
        setMessage(err.response?.data?.error || 'Çalışan eklenirken bir hata oluştu!');
      });
  };

  return (
    <form onSubmit={handleSaveEmployee} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      {message && (
        <p style={{
          fontWeight: 'bold',
          textAlign: 'left',
          color: message.includes('hata') || message.includes('Hata') ? '#d32f2f' : '#2e7d32',
          marginBottom: '15px'
        }}>
          {message}
        </p>
      )}

      <FormField label="T.C. Kimlik No" value={tcNo} onChange={e => setTcNo(e.target.value)} placeholder="11 Haneli TC giriniz" required />
      <FormField label="Ad" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Çalışanın Adı" required />
      <FormField label="Soyad" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Çalışanın Soyadı" required />

      <div style={{ marginBottom: '25px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
          Cinsiyet
        </label>
        <select
          value={gender}
          onChange={e => setGender(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="" disabled>-- Cinsiyet Seçiniz --</option>
          <option value="Kadın">Kadın</option>
          <option value="Erkek">Erkek</option>
          <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
        </select>
      </div>

      <FormField label="Telefon" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxxx" />
      <FormField label="E-posta" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="personel@firma.com" required />
      <FormField label="Ev Adresi" value={homeAddress} onChange={e => setHomeAddress(e.target.value)} placeholder="Açık Adres" />
      <FormField label="Şirket İçi Ünvan" value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="Örn: Kıdemli Kaynak Mühendisi" />
      <FormField label="Maaş" type="number" value={maas} onChange={e => setMaas(e.target.value)} placeholder="Maaş Miktarını Giriniz" />

      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>Bağlı Olacağı Departman</label>
        <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="" disabled>-- Departman Seçiniz --</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.department_name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '25px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>Sistem Giriş Yetkisi (Rol)</label>
        <select value={systemRole} onChange={e => setSystemRole(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="calısan">Düz Çalışan </option>
          <option value="ik">İnsan Kaynakları </option>
          <option value="revir">Sağlık İşleri</option>
          <option value="kk">Kalite Kontrol</option>
        </select>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button type="submit" style={{ background: '#f7a33c' }}>Personeli Kaydet</Button>
      </div>
    </form>
  );
}

export default EmployeeForm;