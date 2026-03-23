import { NextFunction, Request, Response } from 'express';

import { Role } from '@/domain/enums/Role';

export function rbacMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'UNAUTHORIZED', message: 'User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'FORBIDDEN', message: 'User not allowed' });
      return;
    }

    next();
  };
}

