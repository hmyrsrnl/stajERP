import React from 'react';
import Button from '../atoms/Button';

function DepartmentRequestManager({ pendingRequests, onAction }) {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px' }}>
      <h3 style={{ marginTop: 0, color: '#2b5876', borderBottom: '2px solid #2b5876', paddingBottom: '8px', textAlign: 'left' }}>
        Onay Bekleyen Çalışan Talepleri
      </h3>

      {pendingRequests.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', textAlign: 'left', padding: '10px 0' }}>
          Şu anda onayınızı bekleyen herhangi bir talep bulunmamaktadır.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #2b5876' }}>
              <th style={{ padding: '12px 10px' }}>Gönderen</th>
              <th style={{ padding: '12px 10px' }}>Konu</th>
              <th style={{ padding: '12px 10px' }}>Açıklama</th>
              <th style={{ padding: '12px 10px' }}>Tarih</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{req.first_name} {req.last_name}</td>
                <td style={{ padding: '10px' }}>{req.subject}</td>
                <td style={{ padding: '10px' }}>{req.description}</td>
                <td style={{ padding: '10px' }}>{req.created_at}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Button 
                    onClick={() => onAction(req.id, 'Onaylandı')}
                    style={{ padding: '6px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer' }}
                  >
                    Onayla
                  </Button>
                  <Button 
                    onClick={() => onAction(req.id, 'Reddedildi')}
                    style={{ padding: '6px 12px', background: '#c62828', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer' }}
                  >
                    Reddet
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DepartmentRequestManager;