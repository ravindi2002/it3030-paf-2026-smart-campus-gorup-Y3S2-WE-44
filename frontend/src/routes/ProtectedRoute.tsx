import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleType } from '../types/User';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: RoleType | RoleType[];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!user?.role || !roles.includes(user.role as RoleType)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}