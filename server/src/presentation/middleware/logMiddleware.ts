import { NextFunction, Request, Response } from 'express';

export function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - startedAt;
    if (process.env.NODE_ENV !== 'test') {
      // Basic bootstrap logging; persistence is implemented in phase 7.
      console.info(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${elapsed}ms)`,
      );
    }
  });

  next();
}

