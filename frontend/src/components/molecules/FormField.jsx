import React from 'react';

function FormField({ label, type = 'text', value, onChange, placeholder, style }) {
  return (
    <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
      <label style={{ marginBottom: '5px', fontWeight: '500', textAlign: 'left' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange} 
        placeholder={placeholder}
        style={{ 
          padding: '8px', 
          borderRadius: '4px', 
          border: '1px solid #ccc', 
          fontSize: '14px',
          outline: 'none',
          ...style 
        }}
      />
    </div>
  );
}

export default FormField;