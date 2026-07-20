import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

function Header({ title, backgroundColor = '#00796b', backPath, backButtonText = 'Geri Dön', children }) {
  const navigate = useNavigate();

  // localstorage'dan login anında saklanan sistem rolünü okuyoruz
  const userRole = localStorage.getItem('system_role');
  const isAdmin = userRole?.toLowerCase() === 'admin';

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
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        
        {isAdmin && !backPath && (
          <Button 
            onClick={() => navigate('/dashboard-selection')} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: '1px solid white', 
              borderRadius: '15px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Geri Dön
          </Button>
        )}

        {children}

        {backPath && (
          <Button 
            onClick={() => navigate(backPath)} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: '1px solid white', 
              borderRadius: '15px',
              color: 'white'
            }}
          >
            {backButtonText}
          </Button>
        )}
        
      </div>
    </div>
  );
}

export default Header;