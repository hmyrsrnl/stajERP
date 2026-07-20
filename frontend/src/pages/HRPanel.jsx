import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import EmployeeTable from '../components/organisms/EmployeeTable';
import Header from '../components/organisms/Header';
import FilterPanel from '../components/organisms/FilterPanel';

function HRPanel() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // 🎯 Filtreleme State Yapıları
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const fetchEmployees = () => {
    axios.get('http://localhost/stajERP/backend/employees.php')
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Veri çekme hatası:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔹 Gelen çalışan verilerinden dinamik olarak benzersiz departman listesi üretiyoruz
  const departmentsList = employees 
    ? [...new Set(employees.map(emp => emp.department_name).filter(Boolean))] 
    : [];

  // 🔄 Checkbox State Değişim İşleyicileri
  const handleGenderChange = (gender) => {
    selectedGenders.includes(gender)
      ? setSelectedGenders(selectedGenders.filter(g => g !== gender))
      : setSelectedGenders([...selectedGenders, gender]);
  };

  const handleDeptChange = (dept) => {
    selectedDepts.includes(dept)
      ? setSelectedDepts(selectedDepts.filter(d => d !== dept))
      : setSelectedDepts([...selectedDepts, dept]);
  };

  const handleStatusChange = (status) => {
    selectedStatus.includes(status)
      ? setSelectedStatus(selectedStatus.filter(s => s !== status))
      : setSelectedStatus([...selectedStatus, status]);
  };

  // 🎛️ Gelişmiş Çoklu Filtreleme Süzgeci
  const filteredEmployees = employees.filter(emp => {
    // 1. İsim Arama Kontrolü
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    
    // 2. Cinsiyet Kontrolü (Veritabanından gelen 'gender' alanına göre)
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(emp.gender);
    
    // 3. Departman Kontrolü
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(emp.department_name);

    // 4. Durum Kontrolü (Veritabanından gelen 'status' alanına göre)
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(emp.status);

    return matchesSearch && matchesGender && matchesDept && matchesStatus;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '75%', margin: '30px auto' }}>

      <Header title="İnsan Kaynakları Ana Sayfa" backgroundColor="#f7a33c">
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
      </Header>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '20px' }}>
        
        {/* 🧩 Atomic Design Filtre Paneli Organizması */}
        <FilterPanel 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departments={departmentsList}
          selectedGenders={selectedGenders}
          onGenderChange={handleGenderChange}
          selectedDepts={selectedDepts}
          onDeptChange={handleDeptChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />

        <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', minHeight: '400px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333', textAlign: 'left' }}>Kayıtlı Çalışanlar</h3>
          <EmployeeTable 
            employees={filteredEmployees} 
            allEmployeesLength={employees.length}
            onSelectEmployee={(emp) => navigate(`/hr/employee/${emp.id}`)} 
            onEditEmployee={(emp) => navigate(`/hr/employee/edit/${emp.id}`)} 
          />
        </div>

      </div>
    </div>
  );
}

export default HRPanel;