import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import NotificationBanner from '../components/molecules/NotificationBanner';
import ProfileInfoCard from '../components/molecules/ProfileInfoCard';
import EmployeeNavActions from '../components/molecules/EmployeeNavActions';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const employeeId = localStorage.getItem('employee_id');

  useEffect(() => {
    if (!employeeId || employeeId === "null") {
      alert("Lütfen önce sisteme giriş yapın!");
      navigate('/');
      return;
    }

    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${employeeId}`)
      .then(res => {
        if (res.data) setEmployeeInfo(res.data);
      })
      .catch(err => {
        console.error("Çalışan bilgisi çekilemedi:", err);
        alert("Oturum bilgileri doğrulanırken bir hata oluştu!");
      });

    axios.get(`http://localhost/stajERP/backend/notifications.php?action=list&employee_id=${employeeId}`)
      .then(res => {
        if (Array.isArray(res.data)) setNotifications(res.data);
      })
      .catch(err => console.error("Bildirimler çekilemedi:", err));

  }, [employeeId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('employee_id');
    localStorage.removeItem('user'); 
    navigate('/');
  };

  if (!employeeInfo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        Oturumunuz kontrol ediliyor...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '60%', margin: '20px auto' }}>

      {/* Organism */}
      <Header
        title={`Hoş Geldiniz, ${employeeInfo.first_name} ${employeeInfo.last_name}`}
        backgroundColor="#2b5876"
        backPath="/"
        backButtonText="Çıkış Yap"
        onClick={handleLogout}
      />

      <NotificationBanner notifications={notifications} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        <ProfileInfoCard employeeInfo={employeeInfo} />

        <EmployeeNavActions onNavigate={navigate} />

      </div>
    </div>
  );
}

export default EmployeeDashboard;