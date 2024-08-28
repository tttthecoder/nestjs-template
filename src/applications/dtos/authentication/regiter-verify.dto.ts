import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterVerifyDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  @ApiProperty({
    example: 'test1@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  @Length(6, 6, { message: 'Otp not valid' })
  otp: string;
}
