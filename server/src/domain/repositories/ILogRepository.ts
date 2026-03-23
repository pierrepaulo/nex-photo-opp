import { Log } from '@/domain/entities/Log';

export interface LogFilters {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateLogInput {
  userId?: string | null;
  ipAddress: string;
  method: string;
  route: string;
  requestBody?: string | null;
  responseStatus: number;
  actionType: string;
  userAgent?: string | null;
}

/** Linha de log com email do usuario (join) para listagem admin. */
export interface LogWithUserEmail extends Log {
  userEmail: string | null;
}

export interface ILogRepository {
  create(data: CreateLogInput): Promise<Log>;
  findMany(filters: LogFilters): Promise<LogWithUserEmail[]>;
  findManyForExport(
    filters: Omit<LogFilters, 'page' | 'limit'>,
    maxRows: number,
  ): Promise<LogWithUserEmail[]>;
  count(filters: Omit<LogFilters, 'page' | 'limit'>): Promise<number>;
}

