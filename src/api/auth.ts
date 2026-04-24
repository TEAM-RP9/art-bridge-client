import { post } from './api';
import type { RequestOptions } from './api';

export interface AuthResponse {
  userId: number;
  email: string;
  role: string;
}

export const login = (email: string, password: string, opts?: RequestOptions) =>
  post<AuthResponse>('/auth/login', { email, password }, { ...opts, skipAuthRefresh: true });

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
    window.location.assign('/login');
  }
}