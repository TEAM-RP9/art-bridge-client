import { ApiError, getCookie, ProblemDetail } from './api';

export async function uploadImage(file: File): Promise<{ url: string }> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
  const url = `${base}/media/upload`;

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  const csrf = getCookie('XSRF-TOKEN');
  if (csrf) {
    headers['X-XSRF-TOKEN'] = csrf;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    let parsed: ProblemDetail | null = null;
    try {
      parsed = JSON.parse(text) as ProblemDetail;
    } catch {
      parsed = null;
    }
    throw new ApiError(parsed ?? { status: response.status, title: response.statusText, detail: 'Upload failed' });
  }

  return JSON.parse(text) as { url: string };
}
