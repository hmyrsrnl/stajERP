import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import FormTextarea from '../components/molecules/FormTextArea';

function ExaminationEdit() {
  const { examinationId } = useParams(); 
  const navigate = useNavigate();

  const [examType, setExamType] = useState('Günlük');
  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState(''); 

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/infirmary.php?action=get_single&examination_id=${examinationId}`)
      .then(res => {
        if (res.data) {
          setExamType(res.data.exam_type);
          setResult(res.data.result);
          setDescription(res.data.description || '');
          setEmployeeId(res.data.employee_id);
        }
      })
      .catch(err => console.error("Muayene detayı getirilemedi:", err));
  }, [examinationId]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedData = {
      exam_type: examType,
      result: result,
      description: description
    };

    axios.post(`http://localhost/stajERP/backend/infirmary.php?action=update&examination_id=${examinationId}`, updatedData)
      .then(res => {
        alert(res.data.message);
        navigate(`/infirmary/employee/${employeeId}/history`); 
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Güncelleme sırasında bir hata oluştu!');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #4db6ac', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b' }}>Muayene Kaydı Düzenleme</h2>
        <Button onClick={() => navigate(`/infirmary/employee/${employeeId}/history`)} style={{ background: '#6c757d' }}>
          Geri Dön
        </Button>
      </div>

      <form onSubmit={handleUpdate} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>Muayene Tipi</label>
          <select 
            value={examType} 
            onChange={e => setExamType(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Günlük">Günlük Muayene (Revir Şikayeti)</option>
            <option value="Periyodik">Periyodik Muayene (Yıllık İSG Kontrolü)</option>
          </select>
        </div>

        <FormField 
          label="Muayene Sonucu / Tanı" 
          value={result} 
          onChange={e => setResult(e.target.value)} 
          placeholder="Tanıyı giriniz..." 
        />

        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>Detaylı Açıklama / İlaçlar</label>
          <FormTextarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="İlaç veya semptom detaylarını giriniz..." 
            rows={4}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
        <Button type="submit" style={{ background: '#00796b'}}>
          Değişiklikleri Kaydet
        </Button>
        </div>
      </form>
    </div>
  );
}

export default ExaminationEdit;