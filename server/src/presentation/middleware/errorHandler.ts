import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = error.statusCode ?? 500;
  if (statusCode >= 500) {
    console.error('[ERROR]', error);
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
    message: statusCode >= 500 ? 'Internal server error' : error.message,
    statusCode,
  });
}

