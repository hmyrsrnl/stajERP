import React from 'react';

function Button({ children, onClick, type = 'button', variant = 'primary', style, ...props }) {
  
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: variant === 'primary' ? '#87bbf2' : '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      style={{ ...buttonStyle, ...style }} 
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;