import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import EmployeeTable from '../components/organisms/EmployeeTable';
import DepartmentRequestManager from '../components/organisms/DepartmentRequestManager';

function HRPanel() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchEmployees = () => {
    axios.get('http://localhost/stajERP/backend/employees.php')
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Veri çekme hatası:", err));
  };

  const fetchPendingRequests = () => {
    axios.get('http://localhost/stajERP/backend/requests.php?action=department_list&role=İnsan Kaynakları')
      .then(res => setPendingRequests(res.data))
      .catch(err => console.error("Bekleyen İK talepleri çekilemedi:", err));
  };

  useEffect(() => {
    fetchEmployees();
    fetchPendingRequests();
  }, []);

  const handleRequestAction = (requestId, status) => {
    axios.post('http://localhost/stajERP/backend/requests.php?action=update_status', {
      request_id: requestId,
      status: status
    })
      .then(res => {
        alert(res.data.message);
        fetchPendingRequests();
      })
      .catch(err => {
        console.error("Talep güncellenirken hata oluştu:", err);
        alert("İşlem gerçekleştirilemedi!");
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7a33c', color: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>İnsan Kaynakları Ana Sayfa</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => navigate('/hr/hr-requests')}
            style={{ padding: '8px 15px', background: '#f3a77b', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
            Talepler
          </Button>
          <Button onClick={() => navigate('/hr/add-employee')}
            style={{ padding: '8px 15px', background: '#f4894c', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
            Yeni Çalışan Ekleme
          </Button>
          <Button onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{ padding: '8px 15px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer' }}>
            Çıkış
          </Button>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

        <div>
          <EmployeeTable
            employees={employees}
            onSelectEmployee={(emp) => navigate(`/hr/employee/${emp.id}`)} 
            onEditEmployee={(emp) => navigate(`/hr/employee/edit/${emp.id}`)} 
          />
        </div>



      </div>
    </div>
  );
}

export default HRPanel;