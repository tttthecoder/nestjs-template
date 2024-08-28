import { Gender } from '@domains/common/user-account';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';

export class CreateUserAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'John',
    required: true,
    description: 'The first name of the user.',
    type: 'string',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Doe',
    required: true,
    description: 'The last name of the user.',
    type: 'string',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: 'Gender must be one of the following values: male, female, other',
  })
  @ApiProperty({
    example: Gender.Male,
    type: Gender,
    enum: Gender,
    description: 'The gender of the user.',
    required: true,
  })
  gender: Gender;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2000-01-01',
    required: true,
    type: 'string',
    description: 'The date of birth of the user.',
  })
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty({
    message: `Phone number cannot be empty or whitespace`,
  })
  @Length(9, 15, {
    message: 'Phone number must be between 9 and 15 characters long',
  })
  @Matches(new RegExp(/^\+?1?\d{9,15}$/), {
    message: 'Phone number must be entered in the format: "+999999999". Up to 15 digits allowed.',
  })
  @ApiProperty({
    example: '+84xxxxxxxxxx',
    type: 'string',
    description: 'The phone number of the user.',
    required: true,
  })
  phoneNumber: string;
}
