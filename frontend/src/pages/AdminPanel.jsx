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
                    const data = res.data;

                    const totalEmp = (data.activeEmployees || 0) + (data.passiveEmployees || 0);

                    const totalDept = data.departmentDistribution ? data.departmentDistribution.length : 0;

                    const riskCert = data.riskCertificatesCount || 0;

                    const activeCert = data.certRiskStatus ? (data.certRiskStatus.active || 0) : 0;

                    setStats({
                        totalEmployees: totalEmp,
                        totalDepartments: totalDept,
                        pendingRequests: riskCert, 
                        activeCertificates: activeCert
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
                title="Sistem Yönetim Merkezi"
                backgroundColor="#b22a2a"
                backPath="/dashboard-selection"
                backButtonText="Kontrol Merkezine Dön"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px', marginBottom: '30px' }}>
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
                    <p>Riskli Sertifika / Uyarı</p>
                </div>
                <div style={cardStyle('#bba5f0')}>
                    <h3>{stats.activeCertificates}</h3>
                    <p>Aktif Sertifika</p>
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
    );
}

const cardStyle = (bgColor) => ({
    background: bgColor,
    color: '#0f172a', 
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