import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/atoms/Button';

function HealthCertificatesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    axios.get(`http://localhost/stajERP/backend/employee_detail.php?id=${id}`)
      .then(res => setEmployeeName(`${res.data.first_name} ${res.data.last_name}`))
      .catch(err => console.error(err));

    axios.get(`http://localhost/stajERP/backend/health_certificates.php?action=list&employee_id=${id}`)
      .then(res => setCertificates(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '50%', margin: '30px auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #26a69a', paddingBottom: '10px' }}>
        <h2 style={{ color: '#00796b' }}>Personel Sağlık Sertifikaları ve Raporları ({employeeName})</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => navigate(`/infirmary/employee/${id}/health-certificates/add`)} style={{ background: '#00897b' }}>
            Yeni Sağlık Sertifikası Ekle
          </Button>
          <Button onClick={() => navigate(`/infirmary/employee/${id}`)} style={{ background: '#6c757d' }}>
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
                {/*<th style={{ padding: '12px 10px' }}>Açıklama</th> */}
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.id} style={{ borderBottom: '1px solid #dee2e6', background: '#fff' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{cert.certificate_name}</td>
                  <td style={{ padding: '12px 10px' }}>{cert.issue_date}</td>
                  <td style={{ padding: '12px 10px', color: '#d32f2f' }}>{cert.expiry_date || 'Süresiz'}</td>
                  {/*<td style={{ padding: '12px 10px', fontSize: '14px', color: '#555' }}>{cert.description || '-'}</td> */}
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <Button onClick={() => navigate(`/infirmary/health-certificates/edit/${cert.id}`)} style={{ padding: '5px 10px', fontSize: '12px', background: '#00796b' }}>
                      Düzenle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HealthCertificatesList;