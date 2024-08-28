import { ITokenDto } from '@domains/adapters/jwt.interface';

export class TokenDto implements ITokenDto {
  tokenType: string;
  accessToken: string;
  accessTokenExpires: string;
  refreshToken: string;
}
