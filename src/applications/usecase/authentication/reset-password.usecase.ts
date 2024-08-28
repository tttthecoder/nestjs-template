import { ResetPasswordRequestDto } from '@applications/dtos/authentication/reset-password-request.dto';
import { IJwtService } from '@domains/adapters/jwt.interface';
import { TokenType } from '@domains/common/token';
import { UserAccountStatus } from '@domains/common/user-account';
import { UserAccount, UserLoginData } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { SuccessResponseDto } from '@shared/dtos';
import { HashHelper } from '@shared/helpers';

export class ResetPasswordUseCases implements UseCase<ResetPasswordRequestDto, SuccessResponseDto> {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly jwtTokenService: IJwtService,
  ) {}

  public async execute({ password, token }: ResetPasswordRequestDto): Promise<SuccessResponseDto> {
    const { uuid } = await this.jwtTokenService.checkToken(token, TokenType.ResetPasswordToken);

    const user = await this.unitOfWork.getUserAccountRepository().findOneByUUID(uuid);

    if (this.isBlockedOrInactive(user)) {
      return { result: false };
    }

    const userLoginData: UserLoginData = user.userLoginData;

    const newPasswordHash = await HashHelper.encrypt(password);

    userLoginData.passwordHash = newPasswordHash;

    userLoginData.passwordRecoveryToken = null;

    await this.unitOfWork.getUserLoginDataRepository().updateUserLoginData(userLoginData);

    return {
      result: true,
    };
  }

  private isBlockedOrInactive(user: UserAccount): boolean {
    return !user || user.status == UserAccountStatus.Blocked || user.status == UserAccountStatus.Inactive;
  }
}
