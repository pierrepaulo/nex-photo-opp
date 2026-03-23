import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { Role } from '@/domain/enums/Role';
import { env } from '@/infrastructure/config/env';

type TokenPayload = {
  userId: string;
  role: Role;
  email: string;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing bearer token' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
}

