import { post } from './api';
import type { RequestOptions } from './api';

export interface AuthResponse {
  userId: number;
  email: string;
  role: string;
}

export const login = (email: string, password: string, opts?: RequestOptions) =>
  post<AuthResponse>('/auth/login', { email, password }, opts);