import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

// Interface for role-based access control
interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Protected Route Component
 * Handles authentication and role-based access control
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = [UserRole.USER, UserRole.ADMIN, UserRole.MODERATOR] 
}) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // Check if user is authenticated and has the required role
  const isAuthorized = isAuthenticated && 
    (userRole ? allowedRoles.includes(userRole) : false);

  if (!isAuthenticated) {
    // Redirect to login, preserving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // Redirect to unauthorized page if user doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
