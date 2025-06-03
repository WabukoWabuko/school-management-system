import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ component: Component, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="container py-5">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Component />;
}

export default ProtectedRoute;
