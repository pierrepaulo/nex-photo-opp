import { NextFunction, Request, Response } from 'express';

import { parsePhotoListQuery, parsePhotoStatsQuery } from '@/application/dtos/PhotoListQueryDTO';
import { GetPhotoStatsUseCase } from '@/application/usecases/admin/GetPhotoStatsUseCase';
import { ListPhotosUseCase } from '@/application/usecases/photo/ListPhotosUseCase';

export class AdminController {
  constructor(
    private readonly listPhotosUseCase: ListPhotosUseCase,
    private readonly getPhotoStatsUseCase: GetPhotoStatsUseCase,
  ) {}

  async listPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = parsePhotoListQuery(req.query as Record<string, unknown>);
      const result = await this.listPhotosUseCase.execute(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = parsePhotoStatsQuery(req.query as Record<string, unknown>);
      const result = await this.getPhotoStatsUseCase.execute(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  listLogs(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }

  exportLogs(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }
}
