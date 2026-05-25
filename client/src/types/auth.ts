export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  ORG_STAFF: 'ORG_STAFF',
  UNIT_OPERATOR: 'UNIT_OPERATOR',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  email: string;
  role: Role;
  orgId?: string;
  unitId?: string;
}
