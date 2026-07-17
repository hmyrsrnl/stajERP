import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import EmployeeTable from '../components/organisms/EmployeeTable';

function InfirmaryPanel() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/employees.php')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#4db6ac', color: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Revir Yönetim Paneli</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
        <Button onClick={() => navigate('/infirmary/infirmary-requests')}
          style={{ padding: '8px 15px', background: '#048d7d', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
          Talepler
        </Button>
        <Button onClick={() => { localStorage.clear(); navigate('/'); }}
          style={{ padding: '8px 15px', background: '#048d7d', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
          Çıkış
        </Button>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>

        <EmployeeTable
          style={{ color: '#153d66' }}
          employees={employees}
          onSelectEmployee={(emp) => navigate(`/infirmary/employee/${emp.id}`)}
        />
      </div>
    </div>
  );
}

export default InfirmaryPanel;