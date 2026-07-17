import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import QCDetailCard from '../components/molecules/QCDetailCard';
import Header from '../components/organisms/Header';
import WelderTable from '../components/organisms/WelderTable';


function QCEmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [weldInfo, setWeldInfo] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const fetchCertificates = () => {
    axios.get(`http://localhost/stajERP/backend/quality_control.php?action=list&employee_id=${id}`)
      .then(res => setCertificates(res.data))
      .catch(err => console.error("Sertifikalar yüklenirken hata oluştu:", err));
  };

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => setWeldInfo(res.data))
      .catch(err => console.error("Kaynakçı bilgileri yüklenemedi:", err));

    fetchCertificates();
  }, [id]);

  if (!weldInfo) return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',  maxWidth: '50%', margin: '30px auto' }}>

      <Header
        title="Kaynakçı Sertifikasyon Dosyası"
        backgroundColor="#e18ce7"
        backPath="/qc-panel"
        backButtonText="Geri Dön"
      />

      <QCDetailCard welder={weldInfo} />

      <div style={{ marginBottom: '25px' }}>
        <Button onClick={() => navigate(`/qc/employee/${id}/add-certificate`)} style={{ background: '#a374c0', width: '100%', padding: '12px' }}>
          Yeni Kaynakçı Sertifikası Ekle
        </Button>
      </div>

      <WelderTable
        certificates={certificates}
        onEditClick={(certId) => navigate(`/qc/edit-certificate/${certId}`)}
        onDeleteSuccess={fetchCertificates} 
      />
    </div>
  );
}

export default QCEmployeeDetail;