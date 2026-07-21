import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import EmployeeUpdateForm from '../components/organisms/EmployeeUpdateForm';

function EmployeeUpdate() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/departments.php')
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Departmanlar yüklenemedi:", err));

    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => {
        if (res.data) setEmployee(res.data);
      })
      .catch(err => {
        console.error("Çalışan detay hatası:", err);
        alert("Kullanıcı bilgileri yüklenemedi!");
      });
  }, [id]);

  const handleUpdate = (updatedFormData) => {
    axios.post(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`, updatedFormData)
      .then(res => {
        alert(res.data.message || "Çalışan bilgileri başarıyla güncellendi.");
        navigate('/hr-panel'); 
      })
      .catch(err => alert(err.response?.data?.error || "Güncelleme başarısız."));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <Header
        title="Çalışan Bilgileri Güncelleme"
        backgroundColor="#f7a33c"
        backPath="/hr-panel"
        backButtonText="Vazgeç"
      />

      {employee ? (
        <div style={{ marginTop: '20px' }}>
          <EmployeeUpdateForm 
            initialData={employee} 
            departments={departments} 
            onSubmit={handleUpdate} 
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Bilgiler yükleniyor...
        </div>
      )}
    </div>
  );
}

export default EmployeeUpdate;