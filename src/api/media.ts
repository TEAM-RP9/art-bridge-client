import { getCookie, ApiError, type ProblemDetail, type RequestOptions } from './api';
import { refreshSession } from './auth';

export interface MediaUploadResponse {
  url: string;
}

function getMediaBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
}

export function normalizeMediaUrl(url: string): string {
  if (!url || url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  if (/^https?:\/\//i.test(url) || url.startsWith("//")) {
    return url;
  }

  const base = getMediaBaseUrl();

  if (base.startsWith("http://") || base.startsWith("https://")) {
    const absoluteBase = new URL(base.endsWith("/") ? base : `${base}/`);
    return new URL(url, absoluteBase).toString();
  }

  const normalizedBase = base.startsWith("/") ? base : `/${base}`;
  if (url === normalizedBase || url.startsWith(`${normalizedBase}/`)) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function uploadMediaInner(
  file: File,
  opts: RequestOptions | undefined,
  isRetry: boolean,
): Promise<MediaUploadResponse> {
  const base = getMediaBaseUrl();
  const url = `${base}/media/upload`;

  const headers: Record<string, string> = {};
  const csrf = getCookie('XSRF-TOKEN');
  if (csrf) {
    headers['X-XSRF-TOKEN'] = csrf;
  }

  const body = new FormData();
  body.append('file', file);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body,
      signal: opts?.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new ApiError({ status: 0, title: 'Network error', detail: message });
  }

  if (response.status === 401 && !isRetry) {
    let refreshed = false;
    try {
      refreshed = await refreshSession();
    } catch {
      refreshed = false;
    }
    if (refreshed) {
      return uploadMediaInner(file, opts, true);
    }
    throw new ApiError({
      status: 401,
      title: response.statusText,
      detail: 'Session expired',
    });
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

  return JSON.parse(text) as MediaUploadResponse;
}

export function uploadMedia(file: File, opts?: RequestOptions): Promise<MediaUploadResponse> {
  return uploadMediaInner(file, opts, false);
}
