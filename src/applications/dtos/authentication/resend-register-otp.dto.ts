import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResendRegisterOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    description: 'The email address of the user.',
  })
  email: string;
}
