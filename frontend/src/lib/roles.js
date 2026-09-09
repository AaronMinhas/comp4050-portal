export const ROLES = Object.freeze({
  ADMINISTRATOR: 'ADMINISTRATOR',
  SUPERVISOR: 'SUPERVISOR',
  USER: 'USER',
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMINISTRATOR]: 'Administrator',
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.USER]: 'User',
});

export const ROLE_OPTIONS = Object.freeze([
  ROLES.USER,
  ROLES.SUPERVISOR,
  ROLES.ADMINISTRATOR,
]);

export const MOCK_LOGIN_CREDENTIALS = Object.freeze({
  [ROLES.ADMINISTRATOR]: Object.freeze({
    email: 'admin@fitportal.local',
    password: 'admin',
  }),
  [ROLES.SUPERVISOR]: Object.freeze({
    email: 'supervisor@fitportal.local',
    password: 'supervisor',
  }),
  [ROLES.USER]: Object.freeze({
    email: 'user@fitportal.local',
    password: 'user',
  }),
});

const OPERATIONAL_MANAGER_ROLES = new Set([
  ROLES.SUPERVISOR,
  ROLES.ADMINISTRATOR,
]);

export function isRole(role) {
  return Object.hasOwn(ROLE_LABELS, role);
}

export function canRunSolver(role) {
  return OPERATIONAL_MANAGER_ROLES.has(role);
}

export function canManageBoxInventory(role) {
  return OPERATIONAL_MANAGER_ROLES.has(role);
}
