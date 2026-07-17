import React from 'react';

function EmployeeCertificateTable({ certificates }) {
  const getStatusStyle = (status) => {
    return status === 'Aktif' 
      ? { background: '#e8f5e9', color: '#2e7d32' } 
      : { background: '#ffebee', color: '#c62828' };
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      <h3 style={{ marginTop: 0, color: '#333', borderBottom: '1px solid #eee', paddingBottom: '8px', textAlign: 'left' }}>
        Mevcut Sertifikalarım ve Yeterliliklerim
      </h3>
      
      {certificates.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', padding: '10px 0', textAlign: 'left' }}>
          Sisteme kayıtlı aktif bir sertifikanız bulunmamaktadır.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #8fbfba' }}>
              <th style={{ padding: '12px 10px' }}>Sertifika Adı</th>
              <th style={{ padding: '12px 10px' }}>Kategori</th>
              <th style={{ padding: '12px 10px' }}>Seviye / Yeterlilik</th>
              <th style={{ padding: '12px 10px' }}>Veriliş Tarihi</th>
              <th style={{ padding: '12px 10px' }}>Geçerlilik Bitiş</th>
              <th style={{ padding: '12px 10px' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => (
              <tr key={cert.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{cert.certificate_name}</td>
                <td style={{ padding: '10px' }}>{cert.category_name}</td>
                <td style={{ padding: '10px' }}>{cert.level || '-'}</td>
                <td style={{ padding: '10px' }}>{cert.issue_date}</td>
                <td style={{ padding: '10px' }}>{cert.expiry_date}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    ...getStatusStyle(cert.status)
                  }}>
                    {cert.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeCertificateTable;