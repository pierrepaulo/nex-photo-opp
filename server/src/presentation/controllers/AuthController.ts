import { NextFunction, Request, Response } from 'express';

import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.getCurrentUserUseCase.execute(req.user!.userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
