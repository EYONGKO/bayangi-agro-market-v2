import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';

type Props = {
  element: ReactElement;
  requireSeller?: boolean;
};

export default function ProtectedRoute({ element, requireSeller }: Props) {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ redirectTo: location.pathname }} replace />;
  }

  if (requireSeller && currentUser?.role === 'buyer') {
    return <Navigate to="/auth" state={{ redirectTo: location.pathname, needSeller: true }} replace />;
  }

  return element;
}

