import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import FormTextarea from '../components/molecules/FormTextarea';

function ExaminationAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam_type, setExamType] = useState('Günlük');
  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const examinationData = {
      employee_id: id,
      exam_type,
      result,
      description,
      doctor_id: 2
    };

    axios.post(`http://localhost/stajERP/backend/infirmary.php?action=add`, examinationData)
      .then(res => {
        alert(res.data.message);
        navigate(`/infirmary/employee/${id}`);
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Muayene kaydı eklenirken bir hata oluştu!');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #4db6ac', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b' }}>Yeni Muayene Girişi</h2>
        
        <Button onClick={() => navigate(`/infirmary/employee/${id}`)} style={{ background: '#6c757d' }}>
          İptal Et
        </Button>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>

        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>Muayene Tipi</label>
          <select
            value={exam_type}
            onChange={e => setExamType(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Günlük">Günlük Muayene </option>
            <option value="Periyodik">Periyodik Muayene </option>
          </select>
        </div>

        <FormField
          label="Muayene Sonucu / Tanı"
          value={result}
          onChange={e => setResult(e.target.value)}
        />

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>Detaylı Açıklama / İlaçlar</label>
          <FormTextarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type="submit" style={{ textAlign: 'center', background: '#00796b' }}>
            Muayeneyi Sağlık Dosyasına İşle
          </Button></div>
      </form>
    </div>
  );
}

export default ExaminationAdd;