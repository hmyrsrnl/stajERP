import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Button from '../components/atoms/Button';
import Header from '../components/organisms/Header';
import EmployeeTable from '../components/organisms/EmployeeTable';
import FilterPanel from '../components/organisms/FilterPanel';

function InfirmaryPanel() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/employees.php')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleGenderChange = (gender) => {
    selectedGenders.includes(gender)
      ? setSelectedGenders(selectedGenders.filter(g => g !== gender))
      : setSelectedGenders([...selectedGenders, gender]);
  };

  const handleStatusChange = (status) => {
    selectedStatus.includes(status)
      ? setSelectedStatus(selectedStatus.filter(s => s !== status))
      : setSelectedStatus([...selectedStatus, status]);
  };

  const filteredEmployees = employees.filter(emp => {
    const firstName = emp.first_name || emp.Ad || '';
    const lastName = emp.last_name || emp.Soyad || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const currentGender = emp.gender || emp.Cinsiyet;
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(currentGender);

    const currentStatus = emp.status || emp.Status;
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(currentStatus);

    return matchesSearch && matchesGender && matchesStatus;
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revir Personel Listesi");
    XLSX.writeFile(workbook, "Revir_Personel_Listesi.xlsx");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '75%', margin: '30px auto' }}>

      <Header title="Revir Yönetim Paneli" backgroundColor="#4db6ac">
        <Button onClick={() => navigate('/infirmary/infirmary-requests')}
          style={{ padding: '8px 15px', background: '#048d7d', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
          Talepler
        </Button>
        <Button onClick={() => { localStorage.clear(); navigate('/'); }}
          style={{ padding: '8px 15px', background: '#048d7d', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
          Çıkış
        </Button>
      </Header>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '20px' }}>

        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenders={selectedGenders}
          onGenderChange={handleGenderChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          showDepartments={false}
          themeColor="#048d7d"
          onExport={handleExportToExcel}
        />

        <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <EmployeeTable
            employees={filteredEmployees}
            onSelectEmployee={(emp) => navigate(`/infirmary/employee/${emp.id || emp.ID}`)}
          />
        </div>

      </div>
    </div>
  );
}

export default InfirmaryPanel;