import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

function Header({ title, backgroundColor = '#00796b', backPath, backButtonText = 'Çalışanlar Listesi' }) {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: backgroundColor, 
      color: 'white', 
      padding: '15px 20px', 
      borderRadius: '8px', 
      marginBottom: '20px' 
    }}>
      <h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
      
      {backPath && (
        <Button 
          onClick={() => navigate(backPath)} 
          
          style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid white' ,borderRadius :'15px'}}
        >
          {backButtonText}
        </Button>
      )}
    </div>
  );
}

export default Header;