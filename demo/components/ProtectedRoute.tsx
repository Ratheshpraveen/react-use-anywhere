import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthenticationService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const isAuthenticated = AuthenticationService.isAuthenticated();
  const currentUser = AuthenticationService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && currentUser) {
    const hasRequiredRole = requiredRoles.includes(currentUser.role || '');
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
