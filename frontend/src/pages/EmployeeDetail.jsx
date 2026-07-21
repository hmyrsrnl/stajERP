import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import EmployeeDetailCard from '../components/molecules/EmployeeDetailCard';
import Button from '../components/atoms/Button';

function EmployeeDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => {
        if (res.data) setEmployee(res.data);
      })
      .catch(err => {
        console.error("Çalışan detay hatası:", err);
        alert("Kullanıcı bilgileri yüklenemedi!");
      });
  }, [id]);

  const handleDeleteEmployee = () => {
    const confirmDelete = window.confirm(
      `${employee?.first_name} ${employee?.last_name} isimli personeli sistemden tamamen silmek istediğinize emin misiniz?`
    );

    if (confirmDelete) {
      axios.post(`http://localhost/stajERP/backend/employees.php?action=delete&id=${id}`, {})
        .then(res => {
          alert(res.data.message);
          navigate('/hr-panel'); 
        })
        .catch(err => {
          alert(err.response?.data?.error || "Çalışan silinirken bir hata oluştu.");
        });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title="Çalışan Detay Kartı"
        backgroundColor="#f7a33c"
        backPath="/hr-panel"
        backButtonText="Geri Dön"
      />

      {employee ? (
        <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'left', lineHeight: '2', marginTop: '20px' }}>
          
          <EmployeeDetailCard employee={employee} />

          <div style={{ marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <Button 
              onClick={() => navigate(`/hr/employee/edit/${id}`)} 
              style={{ background: '#f7a33c', color: 'white' }}
            >
              Düzenle
            </Button>
            <Button 
              onClick={handleDeleteEmployee} 
              style={{ background: '#d32f2f', color: 'white' }}
            >
              Kişiyi Sil
            </Button>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Bilgiler yükleniyor...
        </div>
      )}
    </div>
  );
}

export default EmployeeDetail;