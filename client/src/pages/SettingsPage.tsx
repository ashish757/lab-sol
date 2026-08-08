import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Role } from "../types/auth";
import { RoleGuard } from "../components/guards/RoleGuard";
import { SessionSettingsPage } from "./unitOperator/SessionSettingsPage";
import { OrgAdminSettingsPage } from "./orgAdmin/OrgAdminSettingsPage";

export const SettingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user?.role === Role.ORG_ADMIN) {
    return <OrgAdminSettingsPage />;
  }

  return (
    <RoleGuard allowedRoles={[Role.UNIT_OPERATOR]}>
      <SessionSettingsPage />
    </RoleGuard>
  );
};
