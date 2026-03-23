import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/application/errors/AppError';
import { UploadAndFramePhotoUseCase } from '@/application/usecases/photo/UploadAndFramePhotoUseCase';

export class PhotoController {
  constructor(private readonly uploadAndFramePhotoUseCase: UploadAndFramePhotoUseCase) {}

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file?.buffer?.length) {
        throw new AppError('BAD_REQUEST', 'Photo file is required', 400, 'PHOTO_MISSING');
      }

      const promoterId = req.user!.userId;
      const result = await this.uploadAndFramePhotoUseCase.execute({
        photoBuffer: file.buffer,
        mimeType: file.mimetype,
        promoterId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
