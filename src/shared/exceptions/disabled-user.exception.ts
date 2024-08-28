import { ErrorType } from '@shared/common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class DisabledUserException extends UnauthorizedException {
  constructor(errorType: ErrorType) {
    super({
      errorType,
      message: 'validation.login.user_inactive',
    });
  }
}
