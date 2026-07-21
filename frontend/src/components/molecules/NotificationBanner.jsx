import React, { useState } from 'react';
import Button from '../atoms/Button';
import NotificationBadge from '../atoms/NotificationBadge';

function NotificationBanner({ notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);

  if (notifications.length === 0) return null;

  return (
    <div style={{ marginTop: '15px' }}>

      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffeeba',
        color: '#856404',
        padding: '12px 20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <strong>Yeni Bildiriminiz Var!</strong>
          <NotificationBadge count={notifications.length} />
        </div>
        <Button 
          onClick={() => setShowNotifications(!showNotifications)}
          style={{ background: '#d39e00', color: 'white', padding: '6px 12px', fontSize: '13px' }}
        >
          {showNotifications ? 'Gizle' : 'Bildirimleri Oku '}
        </Button>
      </div>

      {showNotifications && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #b8daff',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '10px',
          textAlign: 'left',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#004085', borderBottom: '1px solid #b8daff', paddingBottom: '5px' }}>
            Gelen Bildirim Kutusu
          </h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {notifications.map((note) => (
              <div key={note.id} style={{
                padding: '10px',
                borderBottom: '1px solid #e9ecef',
                background: '#f8f9fa',
                borderRadius: '5px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', color: '#0056b3' }}>{note.type || 'Sistem Uyarısı'}</span>
                  <span>{note.created_at}</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{note.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBanner;