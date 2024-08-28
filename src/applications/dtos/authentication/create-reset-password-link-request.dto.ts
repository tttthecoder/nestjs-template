import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResetPasswordLinkRequestDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'test1@gmail.com',
  })
  email: string;
}
