import { ErrorType } from '@shared/common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.InvalidCredentials,
      message: 'validation.login.credential_wrong',
    });
  }
}
