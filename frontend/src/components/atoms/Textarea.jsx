import React from 'react';

function Textarea({ value, onChange, placeholder, rows = 4, style, ...props }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        resize: 'vertical',
        boxSizing: 'border-box',
        ...style
      }}
      {...props}
    />
  );
}

export default Textarea;