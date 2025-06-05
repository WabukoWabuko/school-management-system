import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    console.log('ProtectedRoute: Loading...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  const effectiveRole = user.is_superuser ? 'admin' : user.role;
  console.log('ProtectedRoute: User role:', effectiveRole, 'Allowed roles:', allowedRoles);

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    console.log('ProtectedRoute: Role not allowed, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Rendering Outlet for', effectiveRole);
  return <Outlet />;
};

export default ProtectedRoute;
