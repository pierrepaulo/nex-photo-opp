import { Log } from '@/domain/entities/Log';
import {
  CreateLogInput,
  ILogRepository,
  LogFilters,
  LogWithUserEmail,
} from '@/domain/repositories/ILogRepository';
import { prisma } from '@/infrastructure/database/prisma/client';
import { Prisma } from '@prisma/client';

type LogRow = {
  id: string;
  userId: string | null;
  ipAddress: string;
  method: string;
  route: string;
  requestBody: string | null;
  responseStatus: number;
  actionType: string;
  userAgent: string | null;
  createdAt: Date;
};

function toLog(row: LogRow): Log {
  return {
    id: row.id,
    userId: row.userId,
    ipAddress: row.ipAddress,
    method: row.method,
    route: row.route,
    requestBody: row.requestBody,
    responseStatus: row.responseStatus,
    actionType: row.actionType,
    userAgent: row.userAgent,
    createdAt: row.createdAt,
  };
}

function toLogWithUserEmail(
  row: LogRow & { user: { email: string } | null },
): LogWithUserEmail {
  return {
    ...toLog(row),
    userEmail: row.user?.email ?? null,
  };
}

export class PrismaLogRepository implements ILogRepository {
  private buildWhere(filters: Omit<LogFilters, 'page' | 'limit'>): Prisma.LogWhereInput {
    const createdAt: Prisma.DateTimeFilter = {};

    if (filters.startDate) {
      createdAt.gte = filters.startDate;
    }

    if (filters.endDate) {
      createdAt.lte = filters.endDate;
    }

    if (!filters.startDate && !filters.endDate) {
      return {};
    }

    return { createdAt };
  }

  async create(data: CreateLogInput): Promise<Log> {
    const row = await prisma.log.create({
      data: {
        userId: data.userId ?? null,
        ipAddress: data.ipAddress,
        method: data.method,
        route: data.route,
        requestBody: data.requestBody ?? null,
        responseStatus: data.responseStatus,
        actionType: data.actionType,
        userAgent: data.userAgent ?? null,
      },
    });
    return toLog(row);
  }

  async findMany(filters: LogFilters): Promise<LogWithUserEmail[]> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    const rows = await prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { email: true } },
      },
    });

    return rows.map(toLogWithUserEmail);
  }

  async findManyForExport(
    filters: Omit<LogFilters, 'page' | 'limit'>,
    maxRows: number,
  ): Promise<LogWithUserEmail[]> {
    const where = this.buildWhere(filters);

    const rows = await prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: maxRows,
      include: {
        user: { select: { email: true } },
      },
    });

    return rows.map(toLogWithUserEmail);
  }

  async count(filters: Omit<LogFilters, 'page' | 'limit'>): Promise<number> {
    const where = this.buildWhere(filters);

    return prisma.log.count({
      where,
    });
  }
}
