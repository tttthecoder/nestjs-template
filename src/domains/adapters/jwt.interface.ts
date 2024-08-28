import { UserAccount } from '@domains/entities';
import { TokenType } from '@shared/common/enums';

export interface JwtPayload {
  uuid: string;
  hasVerify2FA: boolean;
}

export interface ITokenDto {
  tokenType: string;

  accessToken: string;

  accessTokenExpires: string;

  refreshToken: string;
}

export interface IJwtService {
  checkToken(token: string, type: TokenType): Promise<JwtPayload | Partial<JwtPayload>>;
  createToken(payload: JwtPayload, secret: string, expiresIn: string): Promise<string>;
  createPasswordToken(payload: Pick<JwtPayload, 'uuid'>, secret: string, expiresIn: string): Promise<string>;
  isTokenBlacklist(token: string): Promise<boolean>;

  responseAuthWithToken(
    userAccount: UserAccount,
    hasVerify2FA?: boolean,
  ): Promise<{ user: UserAccount; token: ITokenDto }>;
}
