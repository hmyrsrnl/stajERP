import React from 'react';

function RequestTable({ requests }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Onaylandı': return { background: '#e8f5e9', color: '#2e7d32' };
      case 'Reddedildi': return { background: '#ffebee', color: '#c62828' };
      default: return { background: '#fff9c4', color: '#f57f17' }; 
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      <h3 style={{ marginTop: 0, color: '#333', borderBottom: '1px solid #eee', paddingBottom: '8px', textAlign: 'left' }}>
        Gönderdiğim Talepler
      </h3>
      
      {requests.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', padding: '10px 0' }}>Henüz bir talebiniz bulunmuyor.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #2b5876' }}>
              <th style={{ padding: '10px' }}>Departman</th>
              <th style={{ padding: '10px' }}>Konu</th>
              <th style={{ padding: '10px' }}>Tarih</th>
              <th style={{ padding: '10px' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{req.department}</td>
                <td style={{ padding: '10px' }}>{req.subject}</td>
                <td style={{ padding: '10px' }}>{req.created_at}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    ...getStatusStyle(req.status)
                  }}>
                    {req.status}
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

export default RequestTable;