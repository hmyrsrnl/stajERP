import React from 'react';
import Button from '../atoms/Button';
import NotificationButton from '../atoms/NotificationButton';
import ExpiryWarning from '../molecules/ExpiryWarning';

function HealthCertificatesTable({ 
  certificates = [], 
  onEdit, 
  onDelete, 
  onOpenNotification 
}) {
  const shouldShowNotification = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft <= 15;
  };

  if (certificates.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic', margin: 0 }}>
        Bu çalışana ait yüklenmiş bir sağlık raporu veya sertifikası bulunamadı.
      </p>
    );
  }

  return (
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
                <NotificationButton onClick={() => onOpenNotification(cert)} />
              )}
            </td>

            <td style={{ padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  onClick={() => onEdit(cert.id)}
                  style={{ padding: '5px 10px', fontSize: '12px', background: '#12a48c', color: 'white' }}
                >
                  Düzenle
                </Button>
                <Button
                  onClick={() => onDelete(cert)}
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
  );
}

export default HealthCertificatesTable;