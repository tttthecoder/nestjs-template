import { AuthCredentialsRequestDto } from '@applications/dtos/authentication/auth-credentials-request.dto';
import { TokenDto } from '@applications/dtos/authentication/token.dto';
import { IJwtService } from '@domains/adapters/jwt.interface';
import { UserAccountStatus } from '@domains/common/user-account';
import { UserAccount } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { ErrorType } from '@shared/common/enums';
import { DisabledUserException, InvalidCredentialsException } from '@shared/exceptions';
import { HashHelper } from '@shared/helpers/hash.helper';

export class LoginUseCases implements UseCase<AuthCredentialsRequestDto, { user: UserAccount; token: TokenDto }> {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly jwtTokenService: IJwtService,
  ) {}

  async execute(input: AuthCredentialsRequestDto): Promise<{ user: UserAccount; token: TokenDto }> {
    const { email, password } = input;
    const userAccount: UserAccount = await this.unitOfWork.getUserAccountRepository().findOneByEmail(email);

    const userLoginData = userAccount?.userLoginData;

    if (!userLoginData || !userAccount) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await HashHelper.compare(password, userLoginData.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    if (userAccount.status == UserAccountStatus.Blocked) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }

    if (userAccount.status == UserAccountStatus.Inactive) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }

    return await this.jwtTokenService.responseAuthWithToken(userAccount);
  }
}
