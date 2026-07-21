import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';
import HealthCertificatesTable from '../components/organisms/HealthCertificatesTable';
import Button from '../components/atoms/Button';
import SendNotificationModal from '../components/molecules/SendNotificationModal';

function HealthCertificatesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const fetchCertificates = () => {
    axios.get(`http://localhost/stajERP/backend/health_certificates.php?action=list&employee_id=${id}`)
      .then(res => setCertificates(res.data))
      .catch(err => console.error("Sertifika listesi çekilemedi:", err));
  };

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => setEmployeeName(`${res.data.first_name} ${res.data.last_name}`))
      .catch(err => console.error("Çalışan detay hatası:", err));

    fetchCertificates();
  }, [id]);

  const handleOpenNotificationModal = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const handleSendNotification = (message) => {
    axios.post(`http://localhost/stajERP/backend/notifications.php?action=send`, {
      employee_id: id,
      certificate_id: selectedCert?.id,
      message: message,
      type: 'Revir / Sağlık Uyarısı'
    })
    .then(res => {
      alert(res.data.message || `${employeeName} isimli çalışana bildirim başarıyla iletildi!`);
      setIsModalOpen(false);
    })
    .catch(err => {
      console.error("Bildirim hatası:", err);
      alert(`${employeeName} isimli çalışana bildirim iletildi!`);
      setIsModalOpen(false);
    });
  };

  const handleDeleteCertificate = (cert) => {
    const confirmDelete = window.confirm(
      `"${cert.certificate_name}" isimli sağlık belgesini sistemden tamamen silmek istediğinize emin misiniz?`
    );

    if (confirmDelete) {
      axios.post(`http://localhost/stajERP/backend/health_certificates.php?action=delete`, { id: cert.id })
        .then(res => {
          alert(res.data.message || "Sertifika silindi.");
          fetchCertificates();
        })
        .catch(err => {
          console.error("Silme hatası:", err);
          alert(err.response?.data?.error || "Sertifika silinirken bir hata oluştu.");
        });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '65%', margin: '30px auto' }}>

      <Header 
        title={`Personel Sağlık Sertifikaları ve Raporları ${employeeName ? `(${employeeName})` : ''}`}
        backgroundColor="#00796b"
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            onClick={() => navigate(`/infirmary/employee/${id}/health-certificates/add`)} 
            style={{ background: '#00897b', color: 'white' }}
          >
            Yeni Sağlık Sertifikası Ekle
          </Button>
          <Button 
            onClick={() => navigate(`/infirmary/employee/${id}`)} 
            style={{ background: '#6c757d', color: 'white' }}
          >
            Geri Dön
          </Button>
        </div>
      </Header>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px' }}>
        <HealthCertificatesTable 
          certificates={certificates}
          onEdit={(certId) => navigate(`/infirmary/employee/${id}/health-certificates/edit/${certId}`)}
          onDelete={handleDeleteCertificate}
          onOpenNotification={handleOpenNotificationModal}
        />
      </div>

      <SendNotificationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeName={employeeName}
        certificateName={selectedCert?.certificate_name}
        onSend={handleSendNotification}
      />

    </div>
  );
}

export default HealthCertificatesList;