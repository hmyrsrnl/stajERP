import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx'; // 🎯 1. DÜZELTME: Excel kütüphanesi içeri aktarıldı
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
    const firstName = emp.first_name || emp.Ad || '';
    const lastName = emp.last_name || emp.Soyad || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const currentStatus = emp.status || emp.Status;
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(currentStatus);

    return matchesSearch && matchesStatus;
  });

  const handleExportToExcel = () => {
    if (filteredWelders.length === 0) {
      alert("İndirilecek filtrelenmiş veri bulunamadı!");
      return;
    }

    const excelData = filteredWelders.map(emp => ({
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kalite Kontrol Personel Listesi");
    XLSX.writeFile(workbook, "Kalite_Kontrol_Personel_Listesi.xlsx");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '75%', margin: '30px auto' }}>
      
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
          onExport={handleExportToExcel}
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