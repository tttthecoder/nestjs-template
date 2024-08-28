import { IsNotEmpty, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@shared/decorators';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @MaxLength(2024)
  @ApiProperty()
  token: string;

  @Matches(passwordRegex, { message: 'Password too weak' })
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    example: 'Hello123',
  })
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    example: 'Hello123',
  })
  password_confirm: string;
}
