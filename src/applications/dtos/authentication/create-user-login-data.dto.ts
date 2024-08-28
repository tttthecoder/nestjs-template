import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Length, Matches, Max, MaxLength, Min } from 'class-validator';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class CreateUserLoginDataDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    description: 'The email address associated with the user account.',
    required: true,
  })
  email: string;

  @Matches(passwordRegex, { message: 'Password too weak' })
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    example: 'Admin@123',
    required: true,
    type: 'string',
    description: 'The password associated with the user account.',
  })
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000000000000)
  @ApiProperty({
    example: 1,
    required: false,
    nullable: true,
    type: 'number',
    description: 'The unique identifier of the user account.',
  })
  userAccountId?: number;
}
