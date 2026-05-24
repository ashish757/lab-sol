import { SuperAdminDash } from '../pages/dashboards/SuperAdminDash';
import { OrgAdminDash } from '../pages/dashboards/OrgAdminDash';
import { UnitAdminDash } from '../pages/dashboards/UnitAdminDash';
import { UnitOpDash } from '../pages/dashboards/UnitOpDash';
import { Role } from '../types/auth';

export const routeConfiguration = [
  { path: '/admin', component: SuperAdminDash, allowedRoles: [Role.SUPER_ADMIN] },
  { path: '/org', component: OrgAdminDash, allowedRoles: [Role.ORG_ADMIN] },
  { path: '/unit', component: UnitAdminDash, allowedRoles: [Role.UNIT_ADMIN] },
  { path: '/operator', component: UnitOpDash, allowedRoles: [Role.UNIT_OPERATOR] },
];
