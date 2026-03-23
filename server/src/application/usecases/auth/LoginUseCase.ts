import { LoginRequestDTO } from '@/application/dtos/LoginRequestDTO';
import { LoginResponseDTO } from '@/application/dtos/LoginResponseDTO';
import { AppError } from '@/application/errors/AppError';
import { IHashService } from '@/application/services/IHashService';
import { ITokenService } from '@/application/services/ITokenService';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401, 'LOGIN_WRONG_EMAIL');
    }

    const passwordMatch = await this.hashService.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401, 'LOGIN_WRONG_PASSWORD');
    }

    const token = this.tokenService.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
