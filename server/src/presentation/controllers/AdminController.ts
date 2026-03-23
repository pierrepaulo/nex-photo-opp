import { NextFunction, Request, Response } from 'express';

import { parseLogExportQuery, parseLogListQuery } from '@/application/dtos/LogListQueryDTO';
import { parsePhotoListQuery, parsePhotoStatsQuery } from '@/application/dtos/PhotoListQueryDTO';
import { ExportLogsUseCase } from '@/application/usecases/log/ExportLogsUseCase';
import { ListLogsUseCase } from '@/application/usecases/log/ListLogsUseCase';
import { GetPhotoStatsUseCase } from '@/application/usecases/admin/GetPhotoStatsUseCase';
import { ListPhotosUseCase } from '@/application/usecases/photo/ListPhotosUseCase';

export class AdminController {
  constructor(
    private readonly listPhotosUseCase: ListPhotosUseCase,
    private readonly getPhotoStatsUseCase: GetPhotoStatsUseCase,
    private readonly listLogsUseCase: ListLogsUseCase,
    private readonly exportLogsUseCase: ExportLogsUseCase,
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

  async listLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = parseLogListQuery(req.query as Record<string, unknown>);
      const result = await this.listLogsUseCase.execute(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async exportLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = parseLogExportQuery(req.query as Record<string, unknown>);
      const csv = await this.exportLogsUseCase.execute(filters);
      const filename = `logs-${new Date().toISOString().slice(0, 10)}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}
