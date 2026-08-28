export const apiRoutes = {
  health: {
    base: 'health',
  },
  auth: {
    base: 'api/auth',
    login: 'login',
    setupAccount: 'setup-account',
    setupUser: 'setup-user',
    invitePreview: 'invite-preview',
    activateStaff: 'activate-staff',
  },
  users: {
    base: 'api/users',
    invite: 'invite',
    cancelInvite: 'invite/:tokenId',
    update: ':id',
  },
  organizations: {
    base: 'api/organizations',
    inviteOrg: 'invite',
    cancelInvite: ':id/invite',
    getAll: '',
    getOne: ':id',
  },
  units: {
    base: 'api/units',
    create: '',
    getOne: ':id',
    update: ':id',
    delete: ':id',
  },
  dailyLogs: {
    base: 'api/daily-logs',
    create: '',
    getAll: '',
    getOne: ':id',
    unitLogs: 'unit/:unitId',
    upsert: 'unit/:unitId/upsert',
    lock: ':id/lock',
    unlock: ':id/unlock',
  },
  reports: {
    base: 'api/reports',
    downloadTemplate: 'daily-logs/download',
    downloadOne: 'daily-logs/download/:id',
    saveAndGenerate: 'save-and-generate',
    calculatedExcel: ':id/calculated-excel',
  },
  sessions: {
    base: 'api/sessions',
    getActive: 'active/:unitId',
    upsert: 'upsert',
    lock: 'lock/:id',
  },
} as const;

export const clientRoutes = {
  auth: {
    login: '/login',
    setupAccount: '/account/setup',
    setupUser: '/account/setup/user',
    staffSetup: '/account/staff-setup',
  },
  admin: {
    dashboard: '/admin/dash',
    orgDetails: '/admin/dash/org/:id',
    invite: '/admin/dash/invite',
  },
  org: {
    dashboard: '/org/dash',
    unitDetails: '/org/dash/unit/:id',
    unitSettings: '/org/dash/unit/:id/settings',
  },
  staff: {
    dashboard: '/staff/dash',
  },
  unit: {
    dashboard: '/unit/dash',
    dataEntry: '/unit/log-data/new',
    report: '/unit/log-data/:id',
    logsList: '/unit/logs',
    settings: '/unit/settings',
    customReport: '/unit/custom-report',
  },
  settings: '/settings',
  profile: '/profile',
};

// Absolute path generators for client consumption
export const getClientApiPath = {
  health: () => `/${apiRoutes.health.base}`,
  auth: {
    login: () => `/${apiRoutes.auth.base}/${apiRoutes.auth.login}`,
    setupAccount: () => `/${apiRoutes.auth.base}/${apiRoutes.auth.setupAccount}`,
    setupUser: () => `/${apiRoutes.auth.base}/${apiRoutes.auth.setupUser}`,
    invitePreview: (token: string) => `/${apiRoutes.auth.base}/${apiRoutes.auth.invitePreview}?token=${token}`,
    activateStaff: () => `/${apiRoutes.auth.base}/${apiRoutes.auth.activateStaff}`,
  },
  users: {
    invite: () => `/${apiRoutes.users.base}/${apiRoutes.users.invite}`,
    cancelInvite: (tokenId: string) => `/${apiRoutes.users.base}/invite/${tokenId}`,
    update: (id: string | number) => `/${apiRoutes.users.base}/${id}`,
  },
  organizations: {
    inviteOrg: () => `/${apiRoutes.organizations.base}/${apiRoutes.organizations.inviteOrg}`,
    cancelInvite: (id: string | number) => `/${apiRoutes.organizations.base}/${id}/invite`,
    getAll: () => `/${apiRoutes.organizations.base}`,
    getOne: (id: string | number) => `/${apiRoutes.organizations.base}/${id}`,
  },
  units: {
    create: () => `/${apiRoutes.units.base}`,
    getOne: (id: string | number) => `/${apiRoutes.units.base}/${id}`,
    update: (id: string | number) => `/${apiRoutes.units.base}/${id}`,
    delete: (id: string | number) => `/${apiRoutes.units.base}/${id}`,
  },
  dailyLogs: {
    base: () => `/${apiRoutes.dailyLogs.base}`,
    one: (id: string | number) => `/${apiRoutes.dailyLogs.base}/${id}`,
    unitLogs: (unitId: string) => `/${apiRoutes.dailyLogs.base}/unit/${unitId}`,
    upsert: (unitId: string) => `/${apiRoutes.dailyLogs.base}/unit/${unitId}/upsert`,
    lock: (id: string) => `/${apiRoutes.dailyLogs.base}/${id}/lock`,
    unlock: (id: string) => `/${apiRoutes.dailyLogs.base}/${id}/unlock`,
  },
  reports: {
    downloadTemplate: () => `/${apiRoutes.reports.base}/${apiRoutes.reports.downloadTemplate}`,
    downloadOne: (id: string | number) => `/${apiRoutes.reports.base}/daily-logs/download/${id}`,
    saveAndGenerate: () => `/${apiRoutes.reports.base}/${apiRoutes.reports.saveAndGenerate}`,
    calculatedExcel: (id: string | number) => `/${apiRoutes.reports.base}/${id}/calculated-excel`,
  },
  sessions: {
    getActive: (unitId: string) => `/${apiRoutes.sessions.base}/active/${unitId}`,
    upsert: () => `/${apiRoutes.sessions.base}/${apiRoutes.sessions.upsert}`,
    lock: (id: string) => `/${apiRoutes.sessions.base}/lock/${id}`,
  },
};
