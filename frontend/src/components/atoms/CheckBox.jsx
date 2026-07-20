import React from 'react';

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        style={{ marginRight: '8px', cursor: 'pointer' }}
      /> 
      <span style={{ fontSize: '14px', color: '#495057' }}>{label}</span>
    </label>
  );
}

export default Checkbox;