import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeTable from '../components/organisms/EmployeeTable';

function QCPanel() {
  const navigate = useNavigate();
  const [welders, setWelders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/quality_control.php?action=get_welders')
      .then(res => setWelders(res.data))
      .catch(err => console.error("Kaynakçı listesi yüklenirken hata:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',  maxWidth: '50%', margin: '30px auto'  }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e18ce7', color: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Kalite Kontrol Takip Paneli</h2>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} 
          style={{ padding: '8px 15px', background: '#76399c', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
          Çıkış
        </button>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        
        <EmployeeTable 
          employees={welders} 
          onSelectEmployee={(emp) => navigate(`/qc/employee/${emp.id}`)} 
        />
      </div>
    </div>
  );
}

export default QCPanel;