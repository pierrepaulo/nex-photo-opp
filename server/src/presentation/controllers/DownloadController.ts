import { NextFunction, Request, Response } from 'express';

import { GetPhotoByTokenUseCase } from '@/application/usecases/photo/GetPhotoByTokenUseCase';

export class DownloadController {
  constructor(private readonly getPhotoByTokenUseCase: GetPhotoByTokenUseCase) {}

  async getByToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const raw = req.params.token;
      const token = typeof raw === 'string' ? raw : raw?.[0] ?? '';
      const result = await this.getPhotoByTokenUseCase.execute(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
