import { post } from './api';
import type { RequestOptions } from './api';
import { sanitizeNext } from '@/lib/next-param';

export interface AuthResponse {
  userId: number;
  email: string;
  role: string;
}

export interface UserResponse  {
  userId: number;
  email: string;
}

export const login = (email: string, password: string, opts?: RequestOptions) =>
  post<AuthResponse>('/auth/login', { email, password }, { ...opts, skipAuthRefresh: true });

export const register = (email: string, password: string, opts?: RequestOptions) =>
  post<UserResponse>('/auth/register', { email, password }, { ...opts, skipAuthRefresh: true });

export const logout = (opts?: RequestOptions) =>
  post<void>('/auth/refresh/revoke', undefined, { ...opts, skipAuthRefresh: true });

export const googleLogin = (idToken: string, opts?: RequestOptions) =>
  post<AuthResponse>('/auth/oauth/google', { idToken }, { ...opts, skipAuthRefresh: true });

let refreshInFlight: Promise<boolean> | null = null;

export async function refreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      await post('/auth/refresh', undefined, { skipAuthRefresh: true });
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export function redirectToLogin(): void {
  console.warn('[auth] session refresh failed, redirecting to login');
  if (typeof window !== 'undefined') {
    const raw = window.location.pathname + window.location.search;
    const sanitized = sanitizeNext(raw);
    if (sanitized === '/login') {
      window.location.assign('/login');
    } else {
      window.location.assign(`/login?next=${encodeURIComponent(sanitized)}`);
    }
  }
}