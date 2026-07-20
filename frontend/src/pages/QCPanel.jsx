import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeTable from '../components/organisms/EmployeeTable';
import Header from '../components/organisms/Header';
import FilterPanel from '../components/organisms/FilterPanel'; 

function QCPanel() {
  const navigate = useNavigate();
  const [welders, setWelders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/quality_control.php?action=get_welders')
      .then(res => setWelders(res.data))
      .catch(err => console.error("Kaynakçı listesi yüklenirken hata:", err));
  }, []);

  const handleStatusChange = (status) => {
    selectedStatus.includes(status)
      ? setSelectedStatus(selectedStatus.filter(s => s !== status))
      : setSelectedStatus([...selectedStatus, status]);
  };

  const filteredWelders = welders.filter(emp => {
    // 1. İsim veya Soyisim Arama Kontrolü
    const firstName = emp.first_name || emp.Ad || '';
    const lastName = emp.last_name || emp.Soyad || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const currentStatus = emp.status || emp.Status;
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(currentStatus);

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',  maxWidth: '75%', margin: '30px auto'  }}>
      
      <Header title="Kalite Kontrol Takip Paneli" backgroundColor="#e18ce7">
        <button onClick={() => { localStorage.clear(); navigate('/'); }} 
          style={{ padding: '8px 15px', background: '#76399c', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
          Çıkış
        </button>
      </Header>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '20px' }}>
        
        <FilterPanel 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          showDepartments={false}
          showGenders={false}
          themeColor="#76399c"
        />

        <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <EmployeeTable 
            employees={filteredWelders} 
            onSelectEmployee={(emp) => navigate(`/qc/employee/${emp.id || emp.ID}`)} 
          />
        </div>

      </div>
    </div>
  );
}

export default QCPanel;