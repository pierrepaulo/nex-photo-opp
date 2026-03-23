import { Request, Response } from 'express';

export class PhotoController {
  upload(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }
}

