import { useEffect } from 'react';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';

export default function HomePage() {
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

  if (role === 'clinico') {
    return <Redirect to="/clinico/registrar" />;
  }

  if (role === 'tutor') {
    return <Redirect to="/tutor" />;
  }

  if (role === 'investigador') {
    return <Redirect to="/investigador" />;
  }

  return <Redirect to="/clinico/registrar" />;
}
