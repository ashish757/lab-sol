import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Role } from '../../types/auth';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

/*
 * A wrapper component that conditionally renders its children
 * based on the current user's role.
 * 
 * Used to hide restricted UI elements (like Create/Delete buttons)
 * from roles that are read-only or not permitted.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
