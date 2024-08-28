import { ErrorType } from '@shared/common/enums';
import { BadRequestException } from '@nestjs/common';

export class TooManyRequestException extends BadRequestException {
  constructor() {
    super({
      errorType: ErrorType.TooManyRequests,
      message: `Too many requests`,
    });
  }
}
