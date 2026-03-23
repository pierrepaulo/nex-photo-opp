/**
 * Deriva actionType generico a partir do metodo e path (sem querystring).
 */
export function resolveLogActionType(method: string, originalUrl: string): string {
  const path = originalUrl.split('?')[0] ?? originalUrl;

  if (method === 'POST' && path === '/api/auth/login') {
    return 'AUTH_LOGIN';
  }
  if (method === 'GET' && path === '/api/auth/me') {
    return 'AUTH_ME';
  }
  if (method === 'POST' && path === '/api/photos') {
    return 'PHOTO_UPLOAD';
  }
  if (method === 'GET' && path === '/api/admin/photos') {
    return 'ADMIN_LIST_PHOTOS';
  }
  if (method === 'GET' && path === '/api/admin/photos/stats') {
    return 'ADMIN_PHOTO_STATS';
  }
  if (method === 'GET' && path === '/api/admin/logs') {
    return 'ADMIN_LIST_LOGS';
  }
  if (method === 'GET' && path === '/api/admin/logs/export') {
    return 'ADMIN_EXPORT_LOGS';
  }
  if (method === 'GET' && /^\/api\/download\/[^/]+$/.test(path)) {
    return 'DOWNLOAD_PHOTO';
  }
  if (method === 'GET' && path === '/api/health') {
    return 'HEALTH_CHECK';
  }

  return `HTTP_${method}`;
}
