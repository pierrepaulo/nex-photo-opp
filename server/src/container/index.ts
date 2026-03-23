import fs from 'fs';
import path from 'path';

import { IStorageService } from '@/application/services/IStorageService';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { GetPhotoByTokenUseCase } from '@/application/usecases/photo/GetPhotoByTokenUseCase';
import { UploadAndFramePhotoUseCase } from '@/application/usecases/photo/UploadAndFramePhotoUseCase';
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
import { DownloadController } from '@/presentation/controllers/DownloadController';
import { PhotoController } from '@/presentation/controllers/PhotoController';

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

const frameOverlayPath = path.resolve(process.cwd(), 'src/assets/frame-overlay.png');
if (!fs.existsSync(frameOverlayPath)) {
  throw new Error(
    `Frame overlay not found at ${frameOverlayPath}. Ensure server/src/assets/frame-overlay.png exists.`,
  );
}
const frameOverlayBuffer = fs.readFileSync(frameOverlayPath);

const useCases = {
  loginUseCase: new LoginUseCase(repositories.userRepository, services.hashService, services.tokenService),
  getCurrentUserUseCase: new GetCurrentUserUseCase(repositories.userRepository),
  uploadAndFramePhotoUseCase: new UploadAndFramePhotoUseCase(
    services.storageService,
    services.imageProcessingService,
    repositories.photoRepository,
    frameOverlayBuffer,
    env.CLIENT_URL,
  ),
  getPhotoByTokenUseCase: new GetPhotoByTokenUseCase(repositories.photoRepository),
};

const controllers = {
  authController: new AuthController(useCases.loginUseCase, useCases.getCurrentUserUseCase),
  photoController: new PhotoController(useCases.uploadAndFramePhotoUseCase),
  downloadController: new DownloadController(useCases.getPhotoByTokenUseCase),
};

export const container = {
  repositories,
  services,
  useCases,
  controllers,
};
