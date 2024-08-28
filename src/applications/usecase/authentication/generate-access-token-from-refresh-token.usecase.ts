import { GenerateAccessTokenFromRefreshTokenRequestDto } from '@applications/dtos/authentication/generate-access-token-from-refresh-token-request.dto';
import { TokenDto } from '@applications/dtos/authentication/token.dto';
import { IJwtService, JwtPayload } from '@domains/adapters/jwt.interface';
import { TokenType, UserTokenType } from '@domains/common/token';
import { UserAccountStatus } from '@domains/common/user-account';
import { JWTConfig } from '@domains/config/jwt.interface';
import { BlacklistToken, UserAccount, UserToken } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IsolationLevel } from '@shared/common/enums';
import { Transactional } from '@shared/decorators';
import { InvalidTokenException } from '@shared/exceptions';
import { JwtHelper } from '@shared/helpers';

import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class GenerateAccessTokenFromRefreshTokenUseCase
  implements UseCase<GenerateAccessTokenFromRefreshTokenRequestDto, TokenDto>
{
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly jwtConfig: JWTConfig,
    private readonly jwtTokenService: IJwtService,
  ) {}

  @Transactional({
    replication: true,
    isolationLevel: IsolationLevel.READ_UNCOMMITTED,
  })
  public async execute(
    generateAccessTokenFromRefreshTokenRequestDto: GenerateAccessTokenFromRefreshTokenRequestDto,
  ): Promise<TokenDto> {
    const { refreshToken } = generateAccessTokenFromRefreshTokenRequestDto;

    if (await this.jwtTokenService.isTokenBlacklist(refreshToken)) {
      throw new InvalidTokenException();
    }

    const { uuid, hasVerify2FA } = await this.jwtTokenService.checkToken(refreshToken, TokenType.RefreshToken);
    const user = await this.unitOfWork.getUserAccountRepository().findOneByUUID(uuid);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    if (this.isBlockedOrInactive(user)) {
      throw new BadRequestException('User is inactivated or blocked');
    }

    const userTokens = await this.unitOfWork.getUserTokenRepository().getUserTokenListByUserAccountId(user.id);
    if (!(userTokens && userTokens.length > 0)) {
      throw new InvalidTokenException();
    }

    const oldAccessTokenToBeBlackListed = userTokens.find(
      (token) => token.type === UserTokenType.Access && new Date(token.expiredAt).getTime() > Date.now(),
    );
    if (oldAccessTokenToBeBlackListed) {
      await this.generateBlacklistToken([oldAccessTokenToBeBlackListed], user.id);
    }

    if (userTokens.findIndex((token) => token.token === refreshToken) === -1) {
      throw new InvalidTokenException();
    }

    const accessToken = await this.generateJwtToken({ uuid, hasVerify2FA });
    const userTokenModel = new UserToken();
    userTokenModel.userAccountId = user.id;
    userTokenModel.type = UserTokenType.Access;
    userTokenModel.token = accessToken;
    userTokenModel.expiredAt = await JwtHelper.getExpiredDate(accessToken);
    await this.unitOfWork.getUserTokenRepository().updateUserToken(userTokenModel);

    const result: TokenDto = {
      tokenType: this.jwtConfig.getJwtType(),
      accessToken: accessToken,
      accessTokenExpires: this.jwtConfig.getJwtExpirationTime(),
      refreshToken: refreshToken,
    };
    return result;
  }

  private isBlockedOrInactive(user: UserAccount): boolean {
    return !user || user.status == UserAccountStatus.Blocked || user.status == UserAccountStatus.Inactive;
  }

  private async generateBlacklistToken(userTokens: UserToken[], userAccountId: number): Promise<BlacklistToken[]> {
    if (!userTokens || userTokens.length === 0) {
      return [];
    }

    const blacklistTokens = userTokens.map((userToken) => ({
      token: userToken.token,
      expiredAt: userToken.expiredAt,
      userAccountId: userAccountId,
    }));

    return await this.unitOfWork.getBlacklistTokenRepository().createBlacklistTokens(blacklistTokens);
  }

  private async generateJwtToken(payload: JwtPayload) {
    const accessTokenExpires = this.jwtConfig.getJwtExpirationTime();
    const accessTokenSecret = this.jwtConfig.getJwtSecret();
    const token = this.jwtTokenService.createToken(payload, accessTokenSecret, accessTokenExpires);
    return token;
  }
}
