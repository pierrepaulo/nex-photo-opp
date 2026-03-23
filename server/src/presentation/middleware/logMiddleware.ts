import { NextFunction, Request, Response } from 'express';

import { ILogRepository } from '@/domain/repositories/ILogRepository';
import { getClientIpMasked } from '@/utils/getClientIpMasked';
import { sanitizeBodyForLog } from '@/utils/sanitizeBodyForLog';

import { resolveLogActionType } from './resolveLogActionType';

function userAgentFromReq(req: Request): string | null {
  const ua = req.headers['user-agent'];
  if (typeof ua !== 'string' || ua.trim() === '') {
    return null;
  }
  return ua.slice(0, 512);
}

/**
 * req.user e preenchido apos auth nas rotas; no callback finish a cadeia ja terminou,
 * entao userId reflete sessoes autenticadas corretamente.
 */
export function createLogMiddleware(logRepository: ILogRepository) {
  return function logMiddleware(req: Request, res: Response, next: NextFunction): void {
    const method = req.method;
    const route = req.originalUrl;
    const requestBodySnapshot = sanitizeBodyForLog(req.body);
    const userAgent = userAgentFromReq(req);
    const ipAtStart = getClientIpMasked(req);

    const startedAt = Date.now();
    res.on('finish', () => {
      const elapsed = Date.now() - startedAt;
      if (process.env.NODE_ENV !== 'test') {
        console.info(
          `[${new Date().toISOString()}] ${method} ${route} ${res.statusCode} (${elapsed}ms)`,
        );
      }

      const actionType = resolveLogActionType(method, route);
      const userId = req.user?.userId ?? null;
      const ipAddress = ipAtStart;

      void logRepository
        .create({
          userId,
          ipAddress,
          method,
          route,
          requestBody: requestBodySnapshot,
          responseStatus: res.statusCode,
          actionType,
          userAgent,
        })
        .catch((err: unknown) => {
          console.error('[logMiddleware] Failed to persist log:', err);
        });
    });

    next();
  };
}
