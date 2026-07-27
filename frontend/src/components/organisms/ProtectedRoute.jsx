import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles = [] }) {
  let user = null;

  try {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("localStorage veri okuma hatası:", error);
    user = null;
  }

  if (!user || (!user.id && !user.ID)) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user.System_role || user.system_role || user.role;
    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      alert("Bu alana erişim yetkiniz bulunmamaktadır!");
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;