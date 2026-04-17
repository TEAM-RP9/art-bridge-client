export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly type: string;
  readonly instance: string;

  constructor(problem: ProblemDetail) {
    super(problem.detail ?? problem.title ?? 'Request failed');
    this.name = 'ApiError';
    this.status = problem.status ?? 0;
    this.title = problem.title ?? '';
    this.detail = problem.detail ?? '';
    this.type = problem.type ?? '';
    this.instance = problem.instance ?? '';
  }
}

export interface RequestOptions {
  signal?: AbortSignal;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
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
): Promise<T> {
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
