export function sanitizeNext(raw: string | null | undefined): string {
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) {
    return raw;
  }
  return '/dashboard';
}