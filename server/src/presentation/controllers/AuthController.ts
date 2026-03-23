import { Request, Response } from 'express';

export class AuthController {
  login(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }

  me(_req: Request, res: Response): void {
    res.status(501).json({ message: 'Not implemented in phase 1' });
  }
}

