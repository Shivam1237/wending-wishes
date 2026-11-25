let csrfToken = '';

export function setCsrfToken(token) {
  csrfToken = token || '';
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isForm = options.body instanceof FormData;
  if (options.body && !isForm && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes((options.method || 'GET').toUpperCase()) && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  const response = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(typeof result === 'object' ? result.error || 'Request failed.' : 'Request failed.');
    error.status = response.status;
    error.fields = typeof result === 'object' ? result.fields : undefined;
    throw error;
  }
  return result;
}

export function qrUrl(eventId, format = 'png', download = false) {
  return `/api/admin/events/${encodeURIComponent(eventId)}/qr?format=${format}${download ? '&download=1' : ''}`;
}
