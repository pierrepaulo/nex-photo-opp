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
}

export interface ILogRepository {
  create(data: CreateLogInput): Promise<Log>;
  findMany(filters: LogFilters): Promise<Log[]>;
  count(filters: Omit<LogFilters, 'page' | 'limit'>): Promise<number>;
}

