import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import type { UserRole } from '@/auth/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
