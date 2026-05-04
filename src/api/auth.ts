import { get, post } from './api';
import type { RequestOptions } from './api';
import { sanitizeNext } from '@/lib/next-param';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function mockDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200));
}

export type UserRole = 'USER' | 'ARTIST' | 'ADMIN';
export type RegisterableRole = 'USER' | 'ARTIST';

export interface AuthResponse {
  userId: number;
  email: string;
  role: UserRole;
}

export interface UserResponse  {
  userId: number;
  email: string;
  role: UserRole;
}

export const login = (email: string, password: string, opts?: RequestOptions) =>
  post<AuthResponse>('/auth/login', { email, password }, { ...opts, skipAuthRefresh: true });

export const register = (
  email: string,
  password: string,
  role: RegisterableRole,
  opts?: RequestOptions,
) =>
  post<UserResponse>('/auth/register', { email, password, role }, { ...opts, skipAuthRefresh: true });

export const logout = (opts?: RequestOptions) =>
  post<void>('/auth/refresh/revoke', undefined, { ...opts, skipAuthRefresh: true });

export const googleLogin = (
  idToken: string,
  role?: RegisterableRole,
  opts?: RequestOptions,
) =>
  post<AuthResponse>(
    '/auth/oauth/google',
    role ? { idToken, role } : { idToken },
    { ...opts, skipAuthRefresh: true },
  );

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

const MOCK_USER: AuthResponse = { userId: 1, email: 'artist@example.com', role: 'ARTIST' };

export const getCurrentUser = (opts?: RequestOptions): Promise<AuthResponse> => {
  if (USE_MOCK) return mockDelay(MOCK_USER);
  return get<AuthResponse>('/auth/me', { ...opts, skipAuthRefresh: true });
};

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