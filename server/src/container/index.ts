import { IStorageService } from '@/application/services/IStorageService';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { env } from '@/infrastructure/config/env';
import { PrismaLogRepository } from '@/infrastructure/repositories/PrismaLogRepository';
import { PrismaPhotoRepository } from '@/infrastructure/repositories/PrismaPhotoRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { BcryptHashService } from '@/infrastructure/services/BcryptHashService';
import { FirebaseStorageService } from '@/infrastructure/services/FirebaseStorageService';
import { JwtTokenService } from '@/infrastructure/services/JwtTokenService';
import { LocalDiskStorageService } from '@/infrastructure/services/LocalDiskStorageService';
import { SharpImageService } from '@/infrastructure/services/SharpImageService';
import { AuthController } from '@/presentation/controllers/AuthController';

function createStorageService(): IStorageService {
  if (env.STORAGE_PROVIDER === 'firebase') {
    return new FirebaseStorageService();
  }
  return new LocalDiskStorageService();
}

const repositories = {
  userRepository: new PrismaUserRepository(),
  photoRepository: new PrismaPhotoRepository(),
  logRepository: new PrismaLogRepository(),
};

const services = {
  hashService: new BcryptHashService(),
  tokenService: new JwtTokenService(),
  storageService: createStorageService(),
  imageProcessingService: new SharpImageService(),
};

const useCases = {
  loginUseCase: new LoginUseCase(repositories.userRepository, services.hashService, services.tokenService),
  getCurrentUserUseCase: new GetCurrentUserUseCase(repositories.userRepository),
};

const controllers = {
  authController: new AuthController(useCases.loginUseCase, useCases.getCurrentUserUseCase),
};

export const container = {
  repositories,
  services,
  useCases,
  controllers,
};
