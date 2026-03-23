import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/application/errors/AppError';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    console.debug(`[APP_ERROR] ${error.error}${error.internalCode ? ` (${error.internalCode})` : ''}: ${error.message}`);
    res.status(error.statusCode).json({
      error: error.error,
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  console.error('[ERROR]', error);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    statusCode: 500,
  });
}

