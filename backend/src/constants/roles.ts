export const ROLES = {
  MANAGER: "manager",
  EMPLOYEE: "employee",
  COWORKER: "coworker"
} as const;
export type Role = typeof ROLES[keyof typeof ROLES];
