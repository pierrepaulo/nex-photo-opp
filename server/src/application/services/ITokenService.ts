export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
}
