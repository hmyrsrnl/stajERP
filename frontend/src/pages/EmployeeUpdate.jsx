import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import EmployeeUpdateForm from '../components/organisms/EmployeeUpdateForm';

function EmployeeUpdate() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/departments.php')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => {
        if (res.data) setEmployee(res.data);
      })
      .catch(err => alert("Kullanıcı bilgileri yüklenemedi!"));
  }, [id]);

  const handleUpdate = (updatedFormData) => {
    axios.post(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`, updatedFormData)
      .then(res => {
        alert(res.data.message);
        navigate('/hr-panel'); 
      })
      .catch(err => alert(err.response?.data?.error || "Güncelleme başarısız."));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f7a33c', paddingBottom: '10px' }}>
        <h2 style={{ color: '#f7a33c', margin: 0 }}>Çalışan Bilgileri Güncelleme</h2>
        <Button onClick={() => navigate('/hr-panel')} style={{ padding: '6px 12px', background: '#6c757d' }}>
          Vazgeç
        </Button>
      </div>

      {employee ? (
        <EmployeeUpdateForm 
          initialData={employee} 
          departments={departments} 
          onSubmit={handleUpdate} 
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>Bilgiler yükleniyor...</div>
      )}
    </div>
  );
}

export default EmployeeUpdate;