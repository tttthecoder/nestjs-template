import { UserAccountResponseDto } from '../user-account/user-account-response.dto';
import { TokenDto } from './token.dto';

export class LoginResponseDto {
  token: TokenDto;
  user: UserAccountResponseDto;
}
