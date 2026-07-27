import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import HRPanel from './pages/HRPanel';
import HRRequests from './pages/HRRequests';
import EmployeeAdd from './pages/EmployeeAdd';
import EmployeeDetail from './pages/EmployeeDetail';
import EmployeeUpdate from './pages/EmployeeUpdate';

import InfirmaryPanel from './pages/InfirmaryPanel';
import InfirmaryEmployeeDetail from './pages/InfirmaryEmployeeDetail';
import ExaminationAdd from './pages/ExaminationAdd';
import ExaminationHistory from './pages/ExaminationHistory';
import ExaminationEdit from './pages/ExaminationEdit';
import HealthCertificatesList from './pages/HealthCertificatesList';
import HealthCertificateAdd from './pages/HealthCertificateAdd';
import HealthCertificateEdit from './pages/HealthCertificateEdit';
import InfirmaryRequests from './pages/InfirmaryRequests';

import QCPanel from './pages/QCPanel';
import QCEmployeeDetail from './pages/QCEmployeeDetail';
import QCAddCertificate from './pages/QCAddCertificate';
import QCEditCertificate from './pages/QCEditCertificate';

import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeRequests from './pages/EmployeeRequests';
import EmployeeExaminations from './pages/EmployeeExaminations';
import EmployeeCertificates from './pages/EmployeeCertificates';
import ChangePassword from './pages/ChangePassword';

import DashboardSelection from './pages/DashboardSelection';
import AdminPanel from './pages/AdminPanel';

// Korumalı Rota Bileşeni
import ProtectedRoute from './components/organisms/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/hr-panel" element={<ProtectedRoute allowedRoles={['ik', 'IK', 'admin']}><HRPanel /></ProtectedRoute>} />
        <Route path="/hr/add-employee" element={<ProtectedRoute allowedRoles={['ik', 'IK', 'admin']}><EmployeeAdd /></ProtectedRoute>} />
        <Route path="/hr/employee/:id" element={<ProtectedRoute allowedRoles={['ik', 'IK', 'admin']}><EmployeeDetail /></ProtectedRoute>} />
        <Route path="/hr/hr-requests" element={<ProtectedRoute allowedRoles={['ik', 'IK', 'admin']}><HRRequests /></ProtectedRoute>} />
        <Route path="/hr/employee/edit/:id" element={<ProtectedRoute allowedRoles={['ik', 'IK', 'admin']}><EmployeeUpdate /></ProtectedRoute>} />

        <Route path="/infirmary-panel" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><InfirmaryPanel /></ProtectedRoute>} />
        <Route path="/infirmary/employee/:id" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><InfirmaryEmployeeDetail /></ProtectedRoute>} />
        <Route path="/infirmary/employee/:id/add-examination" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><ExaminationAdd /></ProtectedRoute>} />
        <Route path="/infirmary/employee/:id/history" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><ExaminationHistory /></ProtectedRoute>} />
        <Route path="/infirmary/examination/edit/:examinationId" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><ExaminationEdit /></ProtectedRoute>} />
        <Route path="/infirmary/employee/:id/health-certificates" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><HealthCertificatesList /></ProtectedRoute>} />
        <Route path="/infirmary/employee/:id/health-certificates/add" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><HealthCertificateAdd /></ProtectedRoute>} />
        <Route path="/infirmary/health-certificates/edit/:certificateId" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><HealthCertificateEdit /></ProtectedRoute>} />
        <Route path="/infirmary/infirmary-requests" element={<ProtectedRoute allowedRoles={['revir', 'Revir', 'admin']}><InfirmaryRequests /></ProtectedRoute>} />

        <Route path="/qc-panel" element={<ProtectedRoute allowedRoles={['kalite', 'Kalite', 'admin']}><QCPanel /></ProtectedRoute>} />
        <Route path="/qc/employee/:id" element={<ProtectedRoute allowedRoles={['kalite', 'Kalite', 'admin']}><QCEmployeeDetail /></ProtectedRoute>} />
        <Route path="/qc/employee/:id/add-certificate" element={<ProtectedRoute allowedRoles={['kalite', 'Kalite', 'admin']}><QCAddCertificate /></ProtectedRoute>} />
        <Route path="/qc/edit-certificate/:certificateId" element={<ProtectedRoute allowedRoles={['kalite', 'Kalite', 'admin']}><QCEditCertificate /></ProtectedRoute>} />

        <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/employee/requests" element={<ProtectedRoute><EmployeeRequests /></ProtectedRoute>} />
        <Route path="/employee/examinations" element={<ProtectedRoute><EmployeeExaminations /></ProtectedRoute>} />
        <Route path="/employee/certificates" element={<ProtectedRoute><EmployeeCertificates /></ProtectedRoute>} />
        <Route path="/employee/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        <Route path="/dashboard-selection" element={<ProtectedRoute><DashboardSelection /></ProtectedRoute>} />
        <Route path="/admin-panel" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;