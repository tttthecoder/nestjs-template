import { Reflector } from '@nestjs/core';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { JwtTokenService } from '@infrastructures/services/jwt-token/jwt.service';
import { SKIP_AUTH } from '@shared/decorators/decorator.constant';
import { InvalidTokenException } from '@shared/exceptions';
import { TokenType } from '@domains/common/token';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private tokenService: JwtTokenService,
    private reflector: Reflector,
  ) {
    super();
  }

  /**
   * Verify the token is valid
   * @param context {ExecutionContext}
   * @returns super.canActivate(context)
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [context.getHandler(), context.getClass()]);
    if (skipAuth) {
      return true;
    }

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());
    if (!accessToken) {
      throw new InvalidTokenException();
    }

    const payload = await this.tokenService.checkToken(accessToken, TokenType.AccessToken);

    if (!payload) {
      throw new UnauthorizedException({ message: 'token.unauthorized' });
    }

    if (await this.tokenService.isTokenBlacklist(accessToken)) {
      throw new InvalidTokenException();
    }
    context.switchToHttp().getRequest().hasVerify2FA = payload.hasVerify2FA;
    return super.canActivate(context) as Promise<boolean>;
  }

  /**
   * Handle request and verify if exist an error or there's not user
   * @param error
   * @param user
   * @returns user || error
   */
  handleRequest(error, user) {
    if (error || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
