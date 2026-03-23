import { randomUUID } from 'crypto';

import { PhotoResponseDTO } from '@/application/dtos/PhotoResponseDTO';
import { AppError } from '@/application/errors/AppError';
import { IImageProcessingService } from '@/application/services/IImageProcessingService';
import { IStorageService } from '@/application/services/IStorageService';
import { IPhotoRepository } from '@/domain/repositories/IPhotoRepository';

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

export interface UploadAndFramePhotoInput {
  photoBuffer: Buffer;
  mimeType: string;
  promoterId: string;
}

function buildDownloadUrl(clientBaseUrl: string, downloadToken: string): string {
  const base = clientBaseUrl.replace(/\/$/, '');
  return `${base}/download/${downloadToken}`;
}

export class UploadAndFramePhotoUseCase {
  constructor(
    private readonly storageService: IStorageService,
    private readonly imageProcessingService: IImageProcessingService,
    private readonly photoRepository: IPhotoRepository,
    private readonly frameOverlayBuffer: Buffer,
    private readonly clientBaseUrl: string,
  ) {}

  async execute(input: UploadAndFramePhotoInput): Promise<PhotoResponseDTO> {
    if (!input.photoBuffer.length) {
      throw new AppError('BAD_REQUEST', 'Photo file is empty', 400, 'PHOTO_EMPTY');
    }

    const extension = ALLOWED_MIME_TYPES.get(input.mimeType);
    if (!extension) {
      throw new AppError(
        'BAD_REQUEST',
        'Unsupported image type. Use JPEG, PNG or WebP.',
        400,
        'PHOTO_INVALID_TYPE',
      );
    }

    try {
      await this.imageProcessingService.getMetadata(input.photoBuffer);
    } catch {
      throw new AppError('BAD_REQUEST', 'Invalid or corrupted image', 400, 'PHOTO_INVALID_IMAGE');
    }

    let framedBuffer: Buffer;
    try {
      framedBuffer = await this.imageProcessingService.applyFrame(
        input.photoBuffer,
        this.frameOverlayBuffer,
      );
    } catch {
      throw new AppError('BAD_REQUEST', 'Could not process image', 400, 'PHOTO_PROCESS_FAILED');
    }

    const storageRunId = randomUUID();
    const originalFilename = `photos/${storageRunId}/original${extension}`;
    const framedFilename = `photos/${storageRunId}/framed.png`;
    const downloadToken = randomUUID();

    const originalUpload = await this.storageService.upload(
      input.photoBuffer,
      originalFilename,
      input.mimeType,
    );
    const framedUpload = await this.storageService.upload(framedBuffer, framedFilename, 'image/png');

    const photo = await this.photoRepository.create({
      originalUrl: originalUpload.url,
      framedUrl: framedUpload.url,
      downloadToken,
      promoterId: input.promoterId,
    });

    return {
      id: photo.id,
      framedUrl: photo.framedUrl,
      downloadToken: photo.downloadToken,
      downloadUrl: buildDownloadUrl(this.clientBaseUrl, photo.downloadToken),
      createdAt: photo.createdAt.toISOString(),
    };
  }
}
