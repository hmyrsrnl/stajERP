import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';

function DashboardSelection() {
  const navigate = useNavigate();
  
  const systemRole = localStorage.getItem('system_role') || 'calısan';
  const employeeId = localStorage.getItem('employee_id');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const panels = [
    {
      id: 'admin_panel',
      title: 'Sistem Yönetim Paneli ',
      description: 'Tüm sistem ayarları, loglar ve tam yetkili kontrol merkezi.',
      path: '/admin-panel',
      allowedRoles: ['admin']
    },
    {
      id: 'hr_panel',
      title: 'İnsan Kaynakları Paneli',
      description: 'Personel kayıtları, işe alım, maaş ve özlük işleri yönetimi.',
      path: '/hr-panel',
      allowedRoles: ['admin', 'ik']
    },
    {
      id: 'qc_panel',
      title: 'Kalite Kontrol  Paneli',
      description: 'Kaynakçı sertifikasyonları, teknik belgeler ve kalite takibi.',
      path: '/qc-panel',
      allowedRoles: ['admin', 'kk']
    },
    {
      id: 'infirmary_panel',
      title: 'Sağlık İşleri  Paneli',
      description: 'Periyodik muayeneler, ağır iş görebilir raporları ve sağlık takibi.',
      path: '/infirmary-panel',
      allowedRoles: ['admin', 'revir']
    },
    {
      id: 'employee_panel',
      title: 'Kişisel Çalışan Portalı',
      description: 'Kendi profil bilgileriniz, sertifikalarınız ve departman talepleriniz.',
      path: '/employee-dashboard',
      allowedRoles: ['admin', 'ik', 'revir', 'kk', 'calısan']
    }
  ];

  const accessiblePanels = panels.filter(panel => panel.allowedRoles.includes(systemRole));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '40px auto' }}>
      <Header
        title="stajERP Kontrol Merkezi"
        backgroundColor="#1e293b"
        backPath="/"
        backButtonText="Çıkış Yap"
        onClick={handleLogout}
      />

      <div style={{ marginTop: '30px', textAlign: 'left' }}>
        <h2 style={{ color: '#334155', margin: '0 0 10px 0', textAlign:'center' }}>Lütfen Giriş Yapmak İstediğiniz Modülü Seçin</h2>
        

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {accessiblePanels.map(panel => (
            <div
              key={panel.id}
              onClick={() => navigate(panel.path)}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{panel.title}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{panel.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSelection;