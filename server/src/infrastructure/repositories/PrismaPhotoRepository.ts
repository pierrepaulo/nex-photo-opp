import { Photo } from '@/domain/entities/Photo';
import {
  CreatePhotoInput,
  IPhotoRepository,
  PhotoFilters,
} from '@/domain/repositories/IPhotoRepository';
import { prisma } from '@/infrastructure/database/prisma/client';
import { Prisma } from '@/generated/prisma';

export class PrismaPhotoRepository implements IPhotoRepository {
  private buildWhere(filters: Omit<PhotoFilters, 'page' | 'limit'>): Prisma.PhotoWhereInput {
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

  async create(data: CreatePhotoInput): Promise<Photo> {
    return prisma.photo.create({ data });
  }

  async findById(id: string): Promise<Photo | null> {
    return prisma.photo.findUnique({ where: { id } });
  }

  async findByToken(token: string): Promise<Photo | null> {
    return prisma.photo.findUnique({ where: { downloadToken: token } });
  }

  async findMany(filters: PhotoFilters): Promise<Photo[]> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    return prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async count(filters: Omit<PhotoFilters, 'page' | 'limit'>): Promise<number> {
    const where = this.buildWhere(filters);

    return prisma.photo.count({
      where,
    });
  }
}

