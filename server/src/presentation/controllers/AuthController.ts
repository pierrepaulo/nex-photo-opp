import { NextFunction, Request, Response } from 'express';

import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { getClientIpMasked } from '@/utils/getClientIpMasked';
import { sanitizeBodyForLog } from '@/utils/sanitizeBodyForLog';

function userAgentFromReq(req: Request): string | null {
  const ua = req.headers['user-agent'];
  if (typeof ua !== 'string' || ua.trim() === '') {
    return null;
  }
  return ua.slice(0, 512);
}

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logCtx = {
        ipAddress: getClientIpMasked(req),
        method: req.method,
        route: req.originalUrl.split('?')[0] ?? req.originalUrl,
        requestBody: sanitizeBodyForLog(req.body),
        userAgent: userAgentFromReq(req),
      };
      const result = await this.loginUseCase.execute(req.body, logCtx);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.getCurrentUserUseCase.execute(req.user!.userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
