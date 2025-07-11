import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState, loading } = useAuth();

  if (loading) {
    return <div className="loading" />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};