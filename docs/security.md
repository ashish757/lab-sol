# Security & Authentication

Security is paramount. The Enterprise Analysis Tool handles proprietary corporate data and thus enforces strict Role-Based Access Controls (RBAC).

## Roles Hierarchy
The system uses Prisma Enums to classify users:
- `SUPER_ADMIN`: Cross-organizational access and deployment control.
- `ORG_ADMIN`: Organization-level control (inviting staff, creating factory units).
- `ORG_STAFF`: Read-only viewers at the organizational level.
- `UNIT_OPERATOR`: Factory-floor data entry analysts restricted to a specific `unitId`.

## Protected Route Wrappers
The frontend employs intelligent dynamic routing via `routeConf.ts`. 
Dashboard mount points evaluate the active Redux authentication session. If a `UNIT_OPERATOR` attempts to access the `/admin/dash` endpoint, the React wrapper intercepts the render cycle and redirects them to the `/unauthorized` route component immediately.

## Magic Link Onboarding
We do not use open registration forms.
1. An Admin dispatches an email via the `/api/users/invite` endpoint.
2. The server generates a unique `InviteToken` (UUID) with a strict TTL, associated with the target `role` and `orgId`. The user's status is set to `INACTIVE`.
3. The email contains a link to the public setup boundary (`/account/setup/user?token=...`).
4. The frontend fetches the pre-configured parameters, prompts the user to create a secure password, and dispatches the activation payload.
5. The backend validates the payload, hashes the password, marks the token as consumed, and switches the user status to `ACTIVE`.
