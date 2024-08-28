import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AuthCredentialsRequestDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'admin@gmail.com',
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Hello123',
  })
  readonly password: string;
}
