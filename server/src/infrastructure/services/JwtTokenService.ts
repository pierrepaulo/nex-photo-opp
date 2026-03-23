import jwt, { SignOptions } from 'jsonwebtoken';

import { ITokenService, TokenPayload } from '@/application/services/ITokenService';
import { env } from '@/infrastructure/config/env';

export class JwtTokenService implements ITokenService {
  sign(payload: TokenPayload): string {
    const signOptions: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, env.JWT_SECRET, signOptions);
  }
}
