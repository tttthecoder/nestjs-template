import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterVerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    description: 'The email address of the user.',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    type: 'string',
    description: 'The OTP (One-Time Password) received for verification.(Should be exactly 6 characters long.)',
  })
  @Length(6, 6, { message: 'Otp not valid' })
  otp: string;
}
