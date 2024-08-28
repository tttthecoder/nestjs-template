import { ApiProperty } from '@nestjs/swagger';
import { UserAccountResponseDto } from '../user-account/user-account-response.dto';
import { TokenDto } from './token.dto';

export class LoginResponseDto {
  @ApiProperty({
    type: () => TokenDto,
  })
  token: TokenDto;

  @ApiProperty({
    type: () => UserAccountResponseDto,
  })
  user: UserAccountResponseDto;
}
