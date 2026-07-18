import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/organisms/Header';

function AdminPanel() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        pendingRequests: 0,
        activeCertificates: 0
    });

    useEffect(() => {
        axios.get('http://localhost/stajERP/backend/admin_stats.php')
            .then(res => {
                if (res.data) {
                    setStats({
                        totalEmployees: res.data.totalEmployees,
                        totalDepartments: res.data.totalDepartments,
                        pendingRequests: res.data.pendingRequests,
                        activeCertificates: res.data.activeCertificates
                    });
                }
            })
            .catch(err => {
                console.error("İstatistikler veritabanından çekilemedi:", err);
            });
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '20px auto' }}>
            <Header
                title="Sistem Yönetim Merkezi "
                backgroundColor="#b22a2a"
                backPath="/dashboard-selection"
                backButtonText="Kontrol Merkezine Dön"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
                <div style={cardStyle('#9ebae8')}>
                    <h3>{stats.totalEmployees}</h3>
                    <p>Toplam Personel</p>
                </div>
                <div style={cardStyle('#9ff3d7')}>
                    <h3>{stats.totalDepartments}</h3>
                    <p>Aktif Departman</p>
                </div>
                <div style={cardStyle('#efd2a0')}>
                    <h3>{stats.pendingRequests}</h3>
                    <p>Bekleyen Talep</p>
                </div>
                <div style={cardStyle('#bba5f0')}>
                    <h3>{stats.activeCertificates}</h3>
                    <p>Tanımlı Sertifika</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '40px', textAlign: 'left' }}>

                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ borderBottom: '2px solid #0f172a', paddingBottom: '10px', color: '#0f172a', margin: '0 0 15px 0' }}>
                        Sistem Durumu ve Log Özetleri
                    </h3>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#334155', lineHeight: '2' }}>
                        <p>[OK] MySQL Veritabanı bağlantısı başarılı. (StajERP)</p>
                        <p>[OK] CORS Güvenlik katmanı aktif: http://localhost:5173</p>
                        <p>[INFO] Rol tabanlı erişim kontrolü (RBAC) devrede.</p>
                        <p>[INFO] Şifreleme algoritması aktif: Bcrypt (password_hash)</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h3 style={{ color: '#0f172a', margin: '0 0 5px 0' }}>Hızlı Geçişler</h3>

                    <button onClick={() => navigate('/hr-panel')} style={btnStyle('#b22a2a')}>
                        İnsan Kaynakları Paneline Git
                    </button>

                    <button onClick={() => navigate('/qc-panel')} style={btnStyle('#b22a2a')}>
                        Kalite Kontrol Paneline Git
                    </button>

                    <button onClick={() => navigate('/employee-dashboard')} style={btnStyle('#b22a2a')}>
                        Kendi Çalışan Profilime Git
                    </button>
                </div>

            </div>
        </div>
    );
}

const cardStyle = (bgColor) => ({
    background: bgColor,
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
});

const btnStyle = (color) => ({
    background: color,
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background 0.2s'
});

export default AdminPanel;