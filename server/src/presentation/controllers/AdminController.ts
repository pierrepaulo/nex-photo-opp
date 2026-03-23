import { Request, Response } from 'express';

export class AdminController {
  listPhotos(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }

  getStats(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }

  listLogs(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }

  exportLogs(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }
}

