import { ErrorType } from '@shared/common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.RefreshTokenExpired,
      message: 'Refresh token has expired',
    });
  }
}
