export const API = {
  BASE: '/api',
  AUTH: '/api/auth',
} as const;

export const AUTH_ROUTES = {
  LOGIN: 'login',
} as const;

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'dev-secret',
  EXPIRY: process.env.JWT_EXPIRY || '1h',
};
