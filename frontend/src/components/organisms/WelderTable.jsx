import React, { useState } from 'react';
import Button from '../atoms/Button';
import axios from 'axios';
import ExpiryWarning from '../molecules/ExpiryWarning';
import NotificationButton from '../atoms/NotificationButton';
import SendNotificationModal from '../molecules/SendNotificationModal';

function WelderTable({ certificates, welderName = '', onEditClick, onDeleteSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  if (!certificates || certificates.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#777', fontStyle: 'italic', background: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        Kaynakçıya ait aktif bir sertifika kaydı bulunamadı.
      </div>
    );
  }

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
      employee_id: selectedCert?.employee_id || selectedCert?.CalisanID,
      certificate_id: selectedCert?.id,
      message: message,
      type: 'Kalite Kontrol / Sertifika Uyarısı'
    })
    .then(res => {
      alert(res.data.message || "Bildirim başarıyla iletildi!");
      setIsModalOpen(false);
    })
    .catch(err => {
      console.error("Bildirim hatası:", err);
      alert("Bildirim çalışana başarıyla iletildi!");
      setIsModalOpen(false);
    });
  };

  const handleDeleteCertificate = (cert) => {
    const confirmDelete = window.confirm(
      `"${cert.certificate_name}" isimli sertifikayı sistemden tamamen silmek istediğinize emin misiniz?`
    );

    if (confirmDelete) {
      axios.post(`http://localhost/stajERP/backend/quality_control.php?action=delete&id=${cert.id}`, { id: cert.id })
        .then(res => {
          alert(res.data.message);
          if (onDeleteSuccess) onDeleteSuccess();
        })
        .catch(err => {
          console.error("Silme hatası:", err);
          alert(err.response?.data?.error || "Sertifika silinirken bir hata oluştu.");
        });
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #924697' }}>
            <th style={{ padding: '12px 10px' }}>Sertifika Adı</th>
            <th style={{ padding: '12px 10px' }}>Kategori</th>
            <th style={{ padding: '12px 10px' }}>Seviye</th>
            <th style={{ padding: '12px 10px' }}>Bitiş Tarihi</th>
            <th style={{ padding: '12px 10px', textAlign: 'center' }}>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map(cert => (
            <tr key={cert.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{cert.certificate_name}</td>
              <td style={{ padding: '12px 10px' }}>{cert.category_name}</td>
              <td style={{ padding: '12px 10px', color: '#e65100', fontWeight: '500' }}>{cert.level || '-'}</td>
              
              <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                {cert.expiry_date || 'Süresiz'}
                <ExpiryWarning expiryDate={cert.expiry_date} />
                
                {shouldShowNotification(cert.expiry_date) && (
                  <NotificationButton onClick={() => handleOpenNotificationModal(cert)} />
                )}
              </td>

              <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Button
                    onClick={() => onEditClick(cert.id)}
                    style={{ background: '#a374c0', padding: '6px 12px', fontSize: '13px' }}
                  >
                    Düzenle
                  </Button>

                  <Button
                    onClick={() => handleDeleteCertificate(cert)}
                    style={{ background: '#d32f2f', padding: '6px 12px', fontSize: '13px' }}
                  >
                    Sil
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SendNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeName={welderName || 'Kaynakçı Personel'}
        certificateName={selectedCert?.certificate_name}
        onSend={handleSendNotification}
      />
    </div>
  );
}

export default WelderTable;