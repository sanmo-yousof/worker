/**
 * Authentication & Session Management Utility
 * Supports Next.js App Router (Server & Client), Next.js Middleware,
 * and static browser environments.
 */

export const AUTH_COOKIE_NAME = 'findworkers_auth_token';
export const USER_COOKIE_NAME = 'findworkers_user_session';

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'client';
  domain?: string;
  avatar?: string;
  escrowBalance?: number;
  token?: string;
  createdAt?: string;
}

export const DEMO_CLIENT: ClientUser = {
  id: 'usr_sarah_connor',
  name: 'Sarah Connor',
  email: 'sarah.connor@cyberdyne.io',
  company: 'Cyberdyne Systems',
  role: 'client',
  domain: 'Software & Coding',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  escrowBalance: 5900,
  createdAt: '2026-01-15T08:00:00Z',
};

/**
 * Generate a lightweight, secure session token containing payload & timestamp
 */
export function generateAuthToken(user: Partial<ClientUser>): string {
  const payload = {
    sub: user.id || 'usr_' + Math.random().toString(36).substring(2, 9),
    email: user.email || DEMO_CLIENT.email,
    name: user.name || DEMO_CLIENT.name,
    company: user.company || DEMO_CLIENT.company,
    role: 'client',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };

  try {
    if (typeof window !== 'undefined') {
      return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } else {
      return Buffer.from(JSON.stringify(payload)).toString('base64');
    }
  } catch {
    return 'fw_token_' + Date.now();
  }
}

/**
 * Validates a token string
 */
export function validateToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  if (token.trim().length < 10) return false;

  try {
    let jsonStr: string;
    if (typeof window !== 'undefined') {
      jsonStr = decodeURIComponent(escape(atob(token)));
    } else {
      jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    }
    const payload = JSON.parse(jsonStr);
    if (!payload || !payload.sub || !payload.exp) return false;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    // If simple prefix token format
    return token.startsWith('fw_token_');
  }
}

/**
 * Client-Side Helper: Set session cookies & localStorage
 */
export function setClientSession(user: ClientUser, token: string, rememberMe = true): void {
  if (typeof window === 'undefined') return;

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8; // 30 days or 8 hours
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

  // Set cookies (accessible by Next.js middleware)
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; expires=${expires}; SameSite=Lax`;
  document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; path=/; expires=${expires}; SameSite=Lax`;

  // Local storage backup
  try {
    localStorage.setItem(AUTH_COOKIE_NAME, token);
    localStorage.setItem(USER_COOKIE_NAME, JSON.stringify(user));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Client-Side Helper: Clear cookies & session
 */
export function clearClientSession(): void {
  if (typeof window === 'undefined') return;

  // Clear cookies
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${USER_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  try {
    localStorage.removeItem(AUTH_COOKIE_NAME);
    localStorage.removeItem(USER_COOKIE_NAME);
  } catch {
    // Ignore
  }
}

/**
 * Client-Side Helper: Read currently logged-in user
 */
export function getClientUser(): ClientUser | null {
  if (typeof window === 'undefined') return null;

  // 1. Try cookie first
  const cookies = document.cookie.split('; ');
  const userCookie = cookies.find((c) => c.startsWith(`${USER_COOKIE_NAME}=`));
  if (userCookie) {
    try {
      const json = decodeURIComponent(userCookie.split('=')[1]);
      return JSON.parse(json);
    } catch {
      // fallback
    }
  }

  // 2. Try localStorage
  try {
    const stored = localStorage.getItem(USER_COOKIE_NAME);
    if (stored) return JSON.parse(stored);
  } catch {
    // fallback
  }

  return null;
}

/**
 * Client-Side Helper: Check if authenticated
 */
export function isClientAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const cookies = document.cookie.split('; ');
  const authCookie = cookies.find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (authCookie) {
    const token = authCookie.split('=')[1];
    return validateToken(token);
  }

  try {
    const token = localStorage.getItem(AUTH_COOKIE_NAME);
    return validateToken(token);
  } catch {
    return false;
  }
}
