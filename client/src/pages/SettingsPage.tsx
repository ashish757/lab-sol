import { Role } from "../types/auth";
import { RoleGuard } from "../components/guards/RoleGuard";
import { SessionSettingsPage } from "./unitOperator/SessionSettingsPage";

export const SettingsPage = () => {
  return (
    <>
    <RoleGuard allowedRoles={[Role.ORG_ADMIN, Role.UNIT_OPERATOR]}>
      <SessionSettingsPage />
    </RoleGuard>
    </>
  );
};
