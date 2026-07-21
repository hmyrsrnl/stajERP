import React, { useState, useEffect } from 'react';
import FormField from '../molecules/FormField';
import FormTextarea from '../molecules/FormTextArea';
import Button from '../atoms/Button';

function ExaminationForm({ initialData = {}, onSubmit, submitButtonText = "Kaydet" }) {
  const [examType, setExamType] = useState('Günlük');
  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData.exam_type) setExamType(initialData.exam_type);
    if (initialData.result) setResult(initialData.result);
    if (initialData.description !== undefined) setDescription(initialData.description);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      exam_type: examType,
      result: result,
      description: description
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      
      <div style={{ marginBottom: '15px', textAlign: 'left' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
          Muayene Tipi
        </label>
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
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
          Detaylı Açıklama / İlaçlar
        </label>
        <FormTextarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="İlaç veya semptom detaylarını giriniz..." 
          rows={4}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button type="submit" style={{ background: '#00796b', color: 'white' }}>
          {submitButtonText}
        </Button>
      </div>

    </form>
  );
}

export default ExaminationForm;