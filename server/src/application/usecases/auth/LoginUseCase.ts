import { LoginLogContextDTO } from '@/application/dtos/LoginLogContextDTO';
import { LoginRequestDTO } from '@/application/dtos/LoginRequestDTO';
import { LoginResponseDTO } from '@/application/dtos/LoginResponseDTO';
import { AppError } from '@/application/errors/AppError';
import { IHashService } from '@/application/services/IHashService';
import { ITokenService } from '@/application/services/ITokenService';
import { ILogRepository } from '@/domain/repositories/ILogRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
    private readonly logRepository: ILogRepository,
  ) {}

  private persistAuthLog(
    ctx: LoginLogContextDTO,
    actionType: string,
    userId: string | null,
    responseStatus: number,
  ): void {
    void this.logRepository
      .create({
        userId,
        ipAddress: ctx.ipAddress,
        method: ctx.method,
        route: ctx.route,
        requestBody: ctx.requestBody,
        responseStatus,
        actionType,
        userAgent: ctx.userAgent,
      })
      .catch((err: unknown) => {
        console.error('[LoginUseCase] Failed to persist auth log:', err);
      });
  }

  async execute(dto: LoginRequestDTO, ctx: LoginLogContextDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      this.persistAuthLog(ctx, 'LOGIN_WRONG_EMAIL', null, 401);
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401, 'LOGIN_WRONG_EMAIL');
    }

    const passwordMatch = await this.hashService.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      this.persistAuthLog(ctx, 'LOGIN_WRONG_PASSWORD', null, 401);
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401, 'LOGIN_WRONG_PASSWORD');
    }

    const token = this.tokenService.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    this.persistAuthLog(ctx, 'LOGIN_SUCCESS', user.id, 200);

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
