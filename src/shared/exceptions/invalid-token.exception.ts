import { ErrorType } from '@shared/common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super({ errorType: ErrorType.InvalidToken, message: 'token.invalid' });
  }
}
