
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/components/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMaster?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireMaster = false }) => {
  const { user, profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireMaster && profile?.email !== 'yuriadrskt@gmail.com') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
