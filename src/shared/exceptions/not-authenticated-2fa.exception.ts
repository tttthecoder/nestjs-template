import { ErrorType } from '@shared/common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class NotAuthenticatedTwofa extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.NotAuthenticatedTwofa,
      message: 'You are not authenticated with 2FA',
    });
  }
}
