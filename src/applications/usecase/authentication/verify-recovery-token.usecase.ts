import { ValidateTokenRequestDto } from '@applications/dtos/authentication/validate-token-request.dto';
import { IJwtService } from '@domains/adapters/jwt.interface';
import { TokenType } from '@domains/common/token';
import { UserAccountStatus } from '@domains/common/user-account';
import { UserAccount } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { SuccessResponseDto } from '@shared/dtos';

export class VerifyRecoveryTokenUseCases implements UseCase<ValidateTokenRequestDto, SuccessResponseDto> {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly jwtTokenService: IJwtService,
  ) {}

  public async execute({ token }: ValidateTokenRequestDto): Promise<SuccessResponseDto> {
    try {
      const { uuid } = await this.jwtTokenService.checkToken(token, TokenType.ResetPasswordToken);

      const user = await this.unitOfWork.getUserAccountRepository().findOneByUUID(uuid);

      if (this.isBlockedOrInactive(user)) {
        return { result: false };
      }

      return {
        result: true,
      };
    } catch (error) {
      return { result: false };
    }
  }

  private isBlockedOrInactive(user: UserAccount): boolean {
    return !user || user.status == UserAccountStatus.Blocked || user.status == UserAccountStatus.Inactive;
  }
}
