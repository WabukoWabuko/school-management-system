import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please log in to access this page.');
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      console.log(`User role ${user.role} not allowed. Required roles: ${allowedRoles.join(', ')}`);
      toast.error('You do not have permission to access this page.');
    }
  }, [user, loading, allowedRoles]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
