import React, { useState } from 'react';
import Button from '../atoms/Button';

function SendNotificationModal({ isOpen, onClose, employeeName, certificateName, onSend }) {
  if (!isOpen) return null;

  const templates = [
    `${certificateName} geçerlilik süreniz dolmak üzeredir. Lütfen en kısa sürede birime uğrayarak yenileme işlemlerini tamamlayınız.`,
    `Sistemde kayıtlı olan ${certificateName} belgenizin süresi yaklaşmıştır. Güncel evraklarınızı teslim etmeniz gerekmektedir.`,
    `Periyodik kontrolleriniz kapsamında ilgili birime gelerek evrak/test işlemlerinizi tekrarlamanız rica olunur.`
  ];

  const [message, setMessage] = useState(templates[0]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 10000
    }}>
      <div style={{
        background: 'white', padding: '25px', borderRadius: '8px',
        width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'left'
      }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #3182ce', paddingBottom: '8px' }}>
          Bildirim Gönder: {employeeName}
        </h3>
        
        <p style={{ fontSize: '13px', color: '#718096', marginBottom: '15px' }}>
          <strong>Belge:</strong> {certificateName}
        </p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568' }}>Hazır Şablon Seçin:</label>
          <select 
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          >
            {templates.map((t, index) => (
              <option key={index} value={t}>Şablon {index + 1}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568' }}>Mesaj İçeriği:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ width: '96%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #cbd5e0', resize: 'none', fontFamily: 'Arial' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button onClick={onClose} style={{ background: '#718096', color: 'white' }}>İptal</Button>
          <Button onClick={() => onSend(message)} style={{ background: '#3182ce', color: 'white' }}>Bildirimi Gönder</Button>
        </div>
      </div>
    </div>
  );
}

export default SendNotificationModal;