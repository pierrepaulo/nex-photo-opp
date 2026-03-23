import { DownloadPhotoPublicDTO } from '@/application/dtos/DownloadPhotoPublicDTO';
import { AppError } from '@/application/errors/AppError';
import { IPhotoRepository } from '@/domain/repositories/IPhotoRepository';

export class GetPhotoByTokenUseCase {
  constructor(private readonly photoRepository: IPhotoRepository) {}

  async execute(token: string): Promise<DownloadPhotoPublicDTO> {
    const trimmed = token?.trim() ?? '';
    if (!trimmed) {
      throw new AppError('BAD_REQUEST', 'Download token is required', 400, 'TOKEN_MISSING');
    }

    const photo = await this.photoRepository.findByToken(trimmed);
    if (!photo) {
      throw new AppError('NOT_FOUND', 'Photo not found', 404, 'PHOTO_NOT_FOUND');
    }

    return { framedUrl: photo.framedUrl };
  }
}
