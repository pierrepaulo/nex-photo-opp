import { Request } from 'express';

import { maskIp } from '@/utils/maskIp';

export function getClientIpMasked(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const fromHeader = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const raw = fromHeader ?? req.socket.remoteAddress ?? req.ip;
  return maskIp(raw);
}
