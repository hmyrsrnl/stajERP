import React from 'react';
import Textarea from '../atoms/Textarea';

function FormTextarea({ label, value, onChange, placeholder, rows }) {
  return (
    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
        {label}
      </label>
      <Textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
    </div>
  );
}

export default FormTextarea;