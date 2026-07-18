import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HRPanel from './pages/HRPanel';
import HRRequests from './pages/HRRequests'
import EmployeeAdd from './pages/EmployeeAdd';
import EmployeeDetail from './pages/EmployeeDetail';
import InfirmaryPanel from './pages/InfirmaryPanel';
import QCPanel from './pages/QCPanel';
import InfirmaryEmployeeDetail from './pages/InfirmaryEmployeeDetail';
import EmployeeUpdate from './pages/EmployeeUpdate';
import ExaminationAdd from './pages/ExaminationAdd';
import ExaminationHistory from './pages/ExaminationHistory';
import ExaminationEdit from './pages/ExaminationEdit';
import HealthCertificatesList from './pages/HealthCertificatesList';
import HealthCertificateAdd from './pages/HealthCertificateAdd';
import HealthCertificateEdit from './pages/HealthCertificateEdit';
import InfirmaryRequests from './pages/InfirmaryRequests';
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/hr-panel" element={<HRPanel />} />
        <Route path="/hr/add-employee" element={<EmployeeAdd />} />
        <Route path="/hr/employee/:id" element={<EmployeeDetail />} />
        <Route path="/hr/hr-requests" element={<HRRequests />} />
        <Route path="/hr/employee/edit/:id" element={<EmployeeUpdate />} />
        <Route path="/infirmary-panel" element={<InfirmaryPanel />} />
        <Route path="/infirmary/employee/:id" element={<InfirmaryEmployeeDetail />} />
        <Route path="/infirmary/employee/:id/add-examination" element={<ExaminationAdd />} />
        <Route path="/infirmary/employee/:id/history" element={<ExaminationHistory />} />
        <Route path="/infirmary/examination/edit/:examinationId" element={<ExaminationEdit />} />
        <Route path="/infirmary/employee/:id/health-certificates" element={<HealthCertificatesList />} />
        <Route path="/infirmary/employee/:id/health-certificates/add" element={<HealthCertificateAdd />} />
        <Route path="/infirmary/health-certificates/edit/:certificateId" element={<HealthCertificateEdit />} />
        <Route path="/infirmary/infirmary-requests" element={<InfirmaryRequests />} />

        <Route path="/qc-panel" element={<QCPanel />} />
        <Route path="/qc/employee/:id" element={<QCEmployeeDetail />} />
        <Route path="/qc/employee/:id/add-certificate" element={<QCAddCertificate />} />
        <Route path="/qc/edit-certificate/:certificateId" element={<QCEditCertificate />} />

        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/requests" element={<EmployeeRequests />} />
        <Route path="/employee/examinations" element={<EmployeeExaminations />} />
        <Route path="/employee/certificates" element={<EmployeeCertificates />} />
        <Route path="/employee/change-password" element={<ChangePassword />} />
        
        <Route path="/dashboard-selection" element={<DashboardSelection />} />
        <Route path="/admin-panel" element={<AdminPanel/>}/>





      </Routes>
    </Router>
  );
}

export default App;