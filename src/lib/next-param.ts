export function sanitizeNext(raw: string | null | undefined, fallback: string = '/dashboard'): string {
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) {
    return raw;
  }
  return fallback;
}