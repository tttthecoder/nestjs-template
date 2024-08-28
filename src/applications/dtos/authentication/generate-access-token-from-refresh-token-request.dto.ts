import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateAccessTokenFromRefreshTokenRequestDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5Yzc1YmIyLTczYzktNGU5Yi1hOTk0LTU5OTFkNWYzODQ2OSIsImlhdCI6MTYyNzgyNjc5OX0.2KI4p-kvVkbYcAeB2PVr8LaJ2Pp9VpTnT1Vyo7SZ9X4',
    description: 'The refresh token to be validated.',
    maxLength: 2024,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2024)
  readonly refreshToken: string;
}
