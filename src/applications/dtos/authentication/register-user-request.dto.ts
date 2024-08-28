import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateUserLoginDataDto } from './create-user-login-data.dto';
import { CreateUserAccountDto } from './create-user-account.dto';

export class RegisterUserRequestDto {
  @ApiProperty({
    description: 'User account details',
    type: CreateUserAccountDto,
    example: {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Male',
      dateOfBirth: '2000-01-01',
      phoneNumber: '+840777494112',
    },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateUserAccountDto)
  @IsObject()
  @IsNotEmptyObject()
  userAccount: CreateUserAccountDto;

  @ApiProperty({
    description: 'User login details',
    type: CreateUserLoginDataDto,
    example: {
      email: 'admin@gmail.com',
      password: 'Admin@123',
    },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateUserLoginDataDto)
  @IsObject()
  @IsNotEmptyObject()
  userLogin: CreateUserLoginDataDto;
}
