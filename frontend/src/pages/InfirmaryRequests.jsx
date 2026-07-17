import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentRequestManager from '../components/organisms/DepartmentRequestManager';
import Header from '../components/organisms/Header';

function InfirmaryRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = () => {
    setLoading(true);
    axios.get('http://localhost/stajERP/backend/requests.php?action=department_list&role=Sağlık İşleri')
      .then(res => {
        setPendingRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Bekleyen Revir talepleri çekilemedi:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
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
      
      <Header 
        title="Personel Talepleri" 
        backgroundColor="#048d7d" 
        backPath="/infirmary-panel"
        backButtonText="Geri Dön"
      />

      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'left', color: '#777' }}>Talepler yükleniyor...</p>
        ) : (
          <DepartmentRequestManager 
            pendingRequests={pendingRequests} 
            onAction={handleRequestAction} 
          />
        )}
      </div>
    </div>
  );
}

export default InfirmaryRequests;