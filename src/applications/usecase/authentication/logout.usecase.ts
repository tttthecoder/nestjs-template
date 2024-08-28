import { BlacklistToken, UserAccount, UserToken } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { IsolationLevel } from '@shared/common/enums';
import { Transactional } from '@shared/decorators';
import { SuccessResponseDto } from '@shared/dtos';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class LogoutUseCases implements UseCase<UserAccount, SuccessResponseDto> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  @Transactional({
    replication: false,
    isolationLevel: IsolationLevel.READ_UNCOMMITTED,
  })
  public async execute(user: UserAccount): Promise<SuccessResponseDto> {
    // Get User-Token
    const userTokens = await this.unitOfWork.getUserTokenRepository().getUserTokenListByUserAccountId(user.id);

    if (!userTokens || userTokens.length === 0) {
      return { result: true };
    }
    const userTokenModel = new UserToken();
    userTokenModel.userAccountId = user.id;
    userTokenModel.type = null;
    userTokenModel.token = null;
    userTokenModel.expiredAt = null;

    await Promise.all([
      this.unitOfWork.getUserTokenRepository().updateUserToken(userTokenModel),
      this.generateBlacklistToken(userTokens, user.id),
    ]);

    return { result: true };
  }

  private async generateBlacklistToken(userTokens: UserToken[], userAccountId: number): Promise<BlacklistToken[]> {
    if (!userTokens || userTokens.length === 0) {
      return [];
    }

    const blacklistTokens = userTokens.map((userToken) => {
      const blacklistedToken = new BlacklistToken();
      blacklistedToken.token = userToken.token;
      blacklistedToken.expiredAt = userToken.expiredAt;
      blacklistedToken.userAccountId = userAccountId;
      return blacklistedToken;
    });

    return await this.unitOfWork.getBlacklistTokenRepository().createBlacklistTokens(blacklistTokens);
  }
}
