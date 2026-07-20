import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import EmployeeTable from '../components/organisms/EmployeeTable';
import Header from '../components/organisms/Header';
import FilterPanel from '../components/organisms/FilterPanel';
import * as XLSX from 'xlsx';

function HRPanel() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

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

  const departmentsList = employees 
    ? [...new Set(employees.map(emp => emp.department_name).filter(Boolean))] 
    : [];

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

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(emp.gender);
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(emp.department_name);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(emp.status);

    return matchesSearch && matchesGender && matchesDept && matchesStatus;
  });

  const handleExportToExcel = () => {
    if (filteredEmployees.length === 0) {
      alert("İndirilecek filtrelenmiş veri bulunamadı!");
      return;
    }

    const excelData = filteredEmployees.map(emp => ({
      'T.C. Kimlik No': emp.tc_no || '',
      'Adı': emp.first_name || emp.Ad || '',
      'Soyadı': emp.last_name || emp.Soyad || '',
      'E-posta Adresi': emp.email || emp.Email || '',
      'Telefon Numarası': emp.phone_number || emp.TelNo || '',
      'Departman': emp.department_name || 'Belirtilmemiş',
      'Unvan / Rol': emp.role_name || emp.Unvan || '',
      'Cinsiyet': emp.gender || emp.Cinsiyet || '',
      'Çalışan Durumu': emp.status || emp.Status || '',
      'İkamet Adresi': emp.home_address || emp.Adres || ''
      
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personel Listesi");
    XLSX.writeFile(workbook, "Filtrelenmiş_Personel_Listesi.xlsx");
  };

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
          onExport={handleExportToExcel}
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