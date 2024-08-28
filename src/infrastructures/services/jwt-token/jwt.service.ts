import { TokenDto } from '@applications/dtos/authentication/token.dto';
import { IJwtService, ITokenDto, JwtPayload } from '@domains/adapters/jwt.interface';
import { UserTokenType } from '@domains/common/token';
import { BlacklistToken, UserAccount, UserToken } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { EnvironmentConfigService } from '@infrastructures/config/environment-config/environment-config.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '@shared/common/enums';
import { JwtHelper } from '@shared/helpers/jwt.helper';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    private readonly jwtConfig: EnvironmentConfigService,
  ) {}

  async checkToken(token: string, type: TokenType): Promise<JwtPayload | Partial<JwtPayload>> {
    return await this.jwtService.verifyAsync(token, {
      algorithms: type === TokenType.ResetPasswordToken ? ['HS256'] : ['HS512'],
      secret:
        type === TokenType.AccessToken
          ? this.jwtConfig.getJwtSecret()
          : type === TokenType.RefreshToken
            ? this.jwtConfig.getJwtRefreshSecret()
            : this.jwtConfig.getJwtPasswordSecret(),
    });
  }

  async createToken(payload: JwtPayload, secret: string, expiresIn: string): Promise<string> {
    return await this.jwtService.sign(payload, {
      secret,
      expiresIn,
      algorithm: 'HS512',
    });
  }

  async createPasswordToken(payload: Pick<JwtPayload, 'uuid'>, secret: string, expiresIn: string): Promise<string> {
    return await this.jwtService.sign(payload, { expiresIn, secret, algorithm: 'HS256' });
  }

  async isTokenBlacklist(token: string): Promise<boolean> {
    const data = await this.unitOfWork.getBlacklistTokenRepository().findByToken(token);

    return !!data;
  }

  async responseAuthWithToken(
    userAccount: UserAccount,
    hasVerify2FA?: boolean,
  ): Promise<{ user: UserAccount; token: ITokenDto }> {
    const token: TokenDto = await this.generateTokens(userAccount, hasVerify2FA);
    await this.updateOrCreateTokens(userAccount, token);

    return {
      user: userAccount,
      token,
    };
  }

  private async generateTokens(userAccount: UserAccount, hasVerify2FA: boolean = false): Promise<TokenDto> {
    const payload: JwtPayload = {
      uuid: userAccount.uuid,
      hasVerify2FA,
    };
    const tokenType = this.jwtConfig.getJwtType();
    const accessTokenExpires = this.jwtConfig.getJwtExpirationTime();
    const [accessToken, refreshToken] = await Promise.all([
      this.generateJwtToken(payload),
      this.generateJwtRefreshToken(payload),
    ]);

    return {
      tokenType,
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  private async generateJwtToken(payload: JwtPayload) {
    const accessTokenExpires = this.jwtConfig.getJwtExpirationTime();
    const accessTokenSecret = this.jwtConfig.getJwtSecret();
    const token = this.createToken(payload, accessTokenSecret, accessTokenExpires);
    return token;
  }

  private async generateJwtRefreshToken(payload: JwtPayload) {
    const refreshTokenExpires = this.jwtConfig.getJwtRefreshExpirationTime();
    const refreshTokenSecret = this.jwtConfig.getJwtRefreshSecret();
    const token = this.createToken(payload, refreshTokenSecret, refreshTokenExpires);
    return token;
  }

  private async updateOrCreateTokens(userAccount: UserAccount, tokens: TokenDto): Promise<void> {
    const userTokens = await this.unitOfWork.getUserTokenRepository().getUserTokenListByUserAccountId(userAccount.id);

    if (!userTokens || userTokens.length === 0) {
      await this.unitOfWork.getUserTokenRepository().creates([
        {
          token: tokens.refreshToken,
          type: UserTokenType.Refresh,
          userAccountId: userAccount.id,
        },
        {
          token: tokens.accessToken,
          type: UserTokenType.Access,
          userAccountId: userAccount.id,
        },
      ]);
    } else {
      if (userTokens[0].token) {
        // Generate Blacklist-token from User-Token
        await this.generateBlacklistToken(userTokens, userAccount.id);
      }

      const accessTokenModel = new UserToken();
      accessTokenModel.userAccountId = userAccount.id;
      accessTokenModel.type = UserTokenType.Access;
      accessTokenModel.token = tokens.accessToken;
      accessTokenModel.expiredAt = await JwtHelper.getExpiredDate(tokens.accessToken);

      const refreshTokenModel = new UserToken();
      refreshTokenModel.userAccountId = userAccount.id;
      refreshTokenModel.type = UserTokenType.Refresh;
      refreshTokenModel.token = tokens.refreshToken;
      refreshTokenModel.expiredAt = await JwtHelper.getExpiredDate(tokens.refreshToken);

      await Promise.all([
        this.unitOfWork.getUserTokenRepository().updateUserToken(accessTokenModel),
        this.unitOfWork.getUserTokenRepository().updateUserToken(refreshTokenModel),
      ]);
    }
  }

  private async generateBlacklistToken(userTokens: UserToken[], userAccountId: number): Promise<BlacklistToken[]> {
    if (!userTokens || userTokens.length === 0) {
      return [];
    }

    return await this.unitOfWork.getBlacklistTokenRepository().createBlacklistTokens(
      userTokens.map((e) => ({
        expiredAt: e.expiredAt,
        token: e.token,
        userAccountId: userAccountId,
      })),
    );
  }
}
