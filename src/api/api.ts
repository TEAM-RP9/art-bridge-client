export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  fieldErrors?: ApiFieldError[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly type: string;
  readonly instance: string;
  readonly fieldErrors: ApiFieldError[];

  constructor(problem: ProblemDetail) {
    super(problem.detail ?? problem.title ?? 'Request failed');
    this.name = 'ApiError';
    this.status = problem.status ?? 0;
    this.title = problem.title ?? '';
    this.detail = problem.detail ?? '';
    this.type = problem.type ?? '';
    this.instance = problem.instance ?? '';
    this.fieldErrors = problem.fieldErrors ?? [];
  }
}

export interface RequestOptions {
  signal?: AbortSignal;
  skipAuthRefresh?: boolean;
}

export interface AuthInterceptor {
  refresh: () => Promise<boolean>;
  onFailure: () => void;
}

let authInterceptor: AuthInterceptor | null = null;

export function setAuthInterceptor(interceptor: AuthInterceptor | null): void {
  authInterceptor = interceptor;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const escaped = name.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const match = new RegExp(new RegExp(`(?:^|; )${escaped}=([^;]*)`)).exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : undefined;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const MUTATING_METHODS: ReadonlySet<HttpMethod> = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Callers must pass paths starting with "/" — the base is concatenated as-is.
async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  opts?: RequestOptions,
  isRetry = false,
): Promise<T> {
  if (!path.startsWith('/')) {
    throw new TypeError(`API client path must start with "/", got: "${path}"`);
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
  const url = `${base}${path}`;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (MUTATING_METHODS.has(method)) {
    const csrf = getCookie('XSRF-TOKEN');
    if (csrf) {
      headers['X-XSRF-TOKEN'] = csrf;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: opts?.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new ApiError({ status: 0, title: 'Network error', detail: message });
  }

  if (response.status === 401 && !isRetry && !opts?.skipAuthRefresh && authInterceptor) {
    const refreshed = await authInterceptor.refresh();
    if (refreshed) {
      return request<T>(method, path, body, opts, true);
    }
    authInterceptor.onFailure();
    throw new ApiError({
      status: 401,
      title: response.statusText,
      detail: 'Session expired',
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!response.ok) {
    if (text) {
      let parsed: ProblemDetail | null = null;
      try {
        parsed = JSON.parse(text) as ProblemDetail;
      } catch {
        parsed = null;
      }
      if (parsed !== null) {
        throw new ApiError(parsed);
      }
    }
    throw new ApiError({
      status: response.status,
      title: response.statusText,
      detail: 'Request failed',
    });
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const get = <T>(path: string, opts?: RequestOptions) =>
  request<T>('GET', path, undefined, opts);

export const post = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  request<T>('POST', path, body, opts);

export const put = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  request<T>('PUT', path, body, opts);

export const patch = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  request<T>('PATCH', path, body, opts);

export const del = <T>(path: string, opts?: RequestOptions) =>
  request<T>('DELETE', path, undefined, opts);
