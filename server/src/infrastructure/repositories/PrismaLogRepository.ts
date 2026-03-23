import { Log } from '@/domain/entities/Log';
import { CreateLogInput, ILogRepository, LogFilters } from '@/domain/repositories/ILogRepository';
import { prisma } from '@/infrastructure/database/prisma/client';
import { Prisma } from '@/generated/prisma';

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
    return prisma.log.create({
      data: {
        userId: data.userId ?? null,
        ipAddress: data.ipAddress,
        method: data.method,
        route: data.route,
        requestBody: data.requestBody ?? null,
        responseStatus: data.responseStatus,
        actionType: data.actionType,
      },
    });
  }

  async findMany(filters: LogFilters): Promise<Log[]> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    return prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async count(filters: Omit<LogFilters, 'page' | 'limit'>): Promise<number> {
    const where = this.buildWhere(filters);

    return prisma.log.count({
      where,
    });
  }
}

