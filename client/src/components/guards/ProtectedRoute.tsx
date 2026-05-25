import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { Role } from '../../types/auth';

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles: Role[];
}

export const ProtectedRoute = ({ component: ComponentToRender, allowedRoles }: ProtectedRouteProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const currentUser = authState.user;

  if (!authState.isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <ComponentToRender />;
};
