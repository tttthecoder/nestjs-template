import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpExpiredException extends HttpException {
  constructor() {
    super({ message: 'Otp has expired' }, HttpStatus.BAD_REQUEST);
  }
}
