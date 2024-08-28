import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpInvalidException extends HttpException {
  constructor() {
    super({ message: 'Otp invalid' }, HttpStatus.BAD_REQUEST);
  }
}
