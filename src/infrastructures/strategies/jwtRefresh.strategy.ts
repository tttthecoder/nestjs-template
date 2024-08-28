import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { JwtTokenService } from '@infrastructures/services/jwt-token/jwt.service';
import { JWTConfig } from '@domains/config/jwt.interface';
import { JwtPayload } from '@domains/adapters/jwt.interface';
import { DisabledUserException, InvalidCredentialsException, InvalidTokenException } from '@shared/exceptions';
import { UserAccountStatus } from '@domains/common/user-account';
import { ErrorType } from '@shared/common/enums';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly userAccountRepository: IUserAccountRepository,
    private tokenService: JwtTokenService,
    private consigService: JWTConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies && request?.cookies[consigService.getJwtRefreshCookieKey()];
        },
      ]),
      secretOrKey: consigService.getJwtRefreshSecret(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const { uuid } = payload;
    const refreshToken = request.cookies[this.consigService.getJwtRefreshCookieKey()];

    if (await this.tokenService.isTokenBlacklist(refreshToken)) {
      throw new InvalidTokenException();
    }

    const userAccount = await this.userAccountRepository.findOneByUUID(uuid);

    if (!userAccount) {
      throw new InvalidCredentialsException();
    }

    if (userAccount.status == UserAccountStatus.Inactive) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }

    if (userAccount.status == UserAccountStatus.Blocked) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }

    if (!(userAccount.tokens && userAccount.tokens.length > 0)) {
      throw new InvalidTokenException();
    }

    if (userAccount.tokens.findIndex((token) => token.token === refreshToken) === -1) {
      throw new InvalidTokenException();
    }

    (request as any).jwtPayload = payload;

    return userAccount;
  }
}
