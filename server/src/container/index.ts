import { PrismaLogRepository } from '@/infrastructure/repositories/PrismaLogRepository';
import { PrismaPhotoRepository } from '@/infrastructure/repositories/PrismaPhotoRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { BcryptHashService } from '@/infrastructure/services/BcryptHashService';
import { FirebaseStorageService } from '@/infrastructure/services/FirebaseStorageService';
import { SharpImageService } from '@/infrastructure/services/SharpImageService';

export const container = {
  repositories: {
    userRepository: new PrismaUserRepository(),
    photoRepository: new PrismaPhotoRepository(),
    logRepository: new PrismaLogRepository(),
  },
  services: {
    hashService: new BcryptHashService(),
    storageService: new FirebaseStorageService(),
    imageProcessingService: new SharpImageService(),
  },
};

