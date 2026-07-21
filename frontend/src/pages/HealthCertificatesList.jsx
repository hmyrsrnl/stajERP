import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';
import NotificationButton from '../components/atoms/NotificationButton';
import ExpiryWarning from '../components/molecules/ExpiryWarning';
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
      .catch(err => console.error(err));

    fetchCertificates();
  }, [id]);

  const shouldShowNotification = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft <= 15;
  };

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
          alert(res.data.message);
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #26a69a', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b', fontSize: '20px' }}>
          Personel Sağlık Sertifikaları ve Raporları <span style={{ color: '#555', fontSize: '16px' }}>({employeeName})</span>
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => navigate(`/infirmary/employee/${id}/health-certificates/add`)} style={{ background: '#00897b', color: 'white' }}>
            Yeni Sağlık Sertifikası Ekle
          </Button>
          <Button onClick={() => navigate(`/infirmary/employee/${id}`)} style={{ background: '#6c757d', color: 'white' }}>
            Geri Dön
          </Button>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        {certificates.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>Bu çalışana ait yüklenmiş bir sağlık raporu veya sertifikası bulunamadı.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#e0f2f1', borderBottom: '2px solid #00796b' }}>
                <th style={{ padding: '12px 10px' }}>Belge / Sertifika Adı</th>
                <th style={{ padding: '12px 10px' }}>Veriliş Tarihi</th>
                <th style={{ padding: '12px 10px' }}>Geçerlilik Tarihi</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.id} style={{ borderBottom: '1px solid #dee2e6', background: '#fff' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{cert.certificate_name}</td>
                  <td style={{ padding: '12px 10px' }}>{cert.issue_date}</td>
                  
                  <td style={{ padding: '12px 10px', color: '#d32f2f', whiteSpace: 'nowrap' }}>
                    {cert.expiry_date || 'Süresiz'}
                    <ExpiryWarning expiryDate={cert.expiry_date} />
                    
                    {shouldShowNotification(cert.expiry_date) && (
                      <NotificationButton onClick={() => handleOpenNotificationModal(cert)} />
                    )}
                  </td>

                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                      <Button
                        onClick={() => navigate(`/infirmary/employee/${id}/health-certificates/edit/${cert.id}`)}
                        style={{ padding: '5px 10px', fontSize: '12px', background: '#12a48c', color: 'white' }}
                      >
                        Düzenle
                      </Button>
                      <Button
                        onClick={() => handleDeleteCertificate(cert)}
                        style={{ background: '#d32f2f', color: 'white', padding: '5px 10px', fontSize: '12px' }}
                      >
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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