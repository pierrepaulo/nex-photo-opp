import { z } from 'zod';

import { AppError } from '@/application/errors/AppError';

export const logListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

function toOptionalDate(value: string | undefined): Date | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new AppError('BAD_REQUEST', 'Invalid date parameter', 400, 'INVALID_DATE');
  }
  return d;
}

export interface LogListFilters {
  page: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
}

export function parseLogListQuery(query: Record<string, unknown>): LogListFilters {
  const parsed = logListQuerySchema.safeParse(query);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    throw new AppError('BAD_REQUEST', message, 400, 'INVALID_QUERY');
  }

  const startDate = toOptionalDate(parsed.data.startDate);
  const endDate = toOptionalDate(parsed.data.endDate);

  if (startDate && endDate && startDate > endDate) {
    throw new AppError(
      'BAD_REQUEST',
      'startDate must be before or equal to endDate',
      400,
      'INVALID_DATE_RANGE',
    );
  }

  return {
    page: parsed.data.page,
    limit: parsed.data.limit,
    startDate,
    endDate,
  };
}

export const logExportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export interface LogExportFilters {
  startDate?: Date;
  endDate?: Date;
}

export function parseLogExportQuery(query: Record<string, unknown>): LogExportFilters {
  const parsed = logExportQuerySchema.safeParse(query);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    throw new AppError('BAD_REQUEST', message, 400, 'INVALID_QUERY');
  }

  const startDate = toOptionalDate(parsed.data.startDate);
  const endDate = toOptionalDate(parsed.data.endDate);

  if (startDate && endDate && startDate > endDate) {
    throw new AppError(
      'BAD_REQUEST',
      'startDate must be before or equal to endDate',
      400,
      'INVALID_DATE_RANGE',
    );
  }

  return { startDate, endDate };
}
