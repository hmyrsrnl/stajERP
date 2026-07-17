import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/organisms/Header';
import RequestForm from '../components/organisms/RequestForm';
import RequestTable from '../components/organisms/RequestTable';

function EmployeeRequests() {
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const employeeId = localStorage.getItem('employee_id');

  const fetchRequests = () => {
    if (!employeeId) return;
    axios.get(`http://localhost/stajERP/backend/requests.php?action=list&employee_id=${employeeId}`)
      .then(res => setRequests(res.data))
      .catch(err => console.error("Talepler çekilemedi:", err));
  };

  useEffect(() => {
    axios.get('http://localhost/stajERP/backend/departments.php')
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Departmanlar çekilemedi:", err));

    fetchRequests();
  }, [employeeId]);

  const handleNewRequest = (formData) => {
    const selectedDeptId = formData.department_id || formData.departmentId || formData.department;

    const postData = {
      employee_id: employeeId,
      department_id: selectedDeptId,
      subject: formData.subject,
      description: formData.description
    };

    console.log("PHP'ye Gönderilen Ham Veri Paketi:", postData);

    if (!postData.employee_id || postData.employee_id === "undefined") {
      alert("Hata: Oturum açmış çalışan ID'si bulunamadı! Lütfen tekrar giriş yapın.");
      return;
    }
    if (!postData.department_id) {
      alert("Hata: Lütfen geçerli bir departman seçiniz!");
      return;
    }

    axios.post('http://localhost/stajERP/backend/requests.php?action=add', postData)
      .then(res => {
        alert(res.data.message);
        fetchRequests();
      })
      .catch(err => {
        console.error("Talep gönderme hatası detayı:", err.response?.data);
        alert(err.response?.data?.error || 'Talep iletilemedi!');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '20px auto' }}>
      <Header 
        title="Talep Yönetim Merkezi" 
        backgroundColor="#2b5876"
        backPath="/employee-dashboard"
        backButtonText="Geri Dön"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', alignItems: 'start' }}>
        <RequestForm onSubmit={handleNewRequest} departments={departments} />
        <RequestTable requests={requests} />
      </div>
    </div>
  );
}

export default EmployeeRequests;