import React from 'react';

function NotificationButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title="Çalışana Bildirim Gönder"
      style={{
        background: disabled ? '#e0e0e0' : '#ebf8ff',
        color: disabled ? '#a0aec0' : '#3182ce',
        border: `1px solid ${disabled ? '#cbd5e0' : '#bee3f8'}`,
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        marginLeft: '10px',
        transition: 'all 0.2s'
      }}
    >
      Bildir
    </button>
  );
}

export default NotificationButton;