import { Gender, UserAccountStatus } from 'src/domains/common/user-account';
import { ApiProperty } from '@nestjs/swagger';

export class UserAccountResponseDto {
  @ApiProperty({
    example: '39c75bb2-73c9-4e9b-a994-5991d5f38469',
    description: 'The unique identifier of the user account.',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user.',
    type: 'string',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user.',
    type: 'string',
  })
  lastName: string;

  @ApiProperty({
    example: Gender.Male,
    type: Gender,
    enum: Gender,
    description: 'The gender of the user.',
  })
  gender: string;

  @ApiProperty({
    example: '2000-01-01 00:00:00',
    type: 'string',
    description: 'The date of birth of the user.',
  })
  dateOfBirth: string;

  @ApiProperty({
    example: '+84xxxxxxxxxx',
    type: 'string',
    description: 'The phone number of the user.',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'https://image.com/xxx/xxx',
    type: 'string',
    description: `The URL to the user's avatar image.`,
  })
  avatar: string;

  @ApiProperty({
    example: UserAccountStatus.Active,
    enum: UserAccountStatus,
    type: UserAccountStatus,
    description: 'The status of the user account',
  })
  status: UserAccountStatus;

  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    description: 'The email address associated with the user account.',
  })
  email: string;

  // @ApiProperty({
  //   type: UserLoginDataResponseDto,
  //   required: false,
  // })
  // userLoginData?: UserLoginDataResponseDto;

  // @ApiProperty({
  //   type: CompanyResponseDto,
  //   required: false,
  // })
  // company?: any;
}
