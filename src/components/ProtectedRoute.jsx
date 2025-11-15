import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in, show the component
  return children;
};

export default ProtectedRoute;