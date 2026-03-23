import { User } from '@/domain/entities/User';
import { Role } from '@/domain/enums/Role';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { prisma } from '@/infrastructure/database/prisma/client';

export class PrismaUserRepository implements IUserRepository {
  private mapRole(rawRole: string): Role {
    if (rawRole === Role.ADMIN) return Role.ADMIN;
    if (rawRole === Role.PROMOTER) return Role.PROMOTER;
    throw new Error(`Unexpected role value returned from database: ${rawRole}`);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findUnique({ where: { email } });
    if (!result) return null;

    return {
      ...result,
      role: this.mapRole(result.role),
    };
  }

  async findById(id: string): Promise<User | null> {
    const result = await prisma.user.findUnique({ where: { id } });
    if (!result) return null;

    return {
      ...result,
      role: this.mapRole(result.role),
    };
  }
}

