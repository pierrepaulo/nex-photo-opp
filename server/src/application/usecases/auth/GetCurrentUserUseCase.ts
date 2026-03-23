import { CurrentUserDTO } from '@/application/dtos/CurrentUserDTO';
import { AppError } from '@/application/errors/AppError';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<CurrentUserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
