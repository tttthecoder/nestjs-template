import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SKIP_2FA } from '@shared/decorators';
import { NotAuthenticatedTwofa } from '@shared/exceptions/not-authenticated-2fa.exception';

@Injectable()
export class TwoFAGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Verify if user has 2FA enabled
   * @param context {ExecutionContext}
   * @returns {Promise<boolean>}
   */

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, hasVerify2FA } = context.switchToHttp().getRequest();

    const skipTwofa = this.reflector.getAllAndOverride<boolean>(SKIP_2FA, [context.getHandler(), context.getClass()]);

    if (skipTwofa) {
      return true;
    }

    if (user && !!user.userLoginData.isTwoFactorEnabled && !hasVerify2FA) {
      throw new NotAuthenticatedTwofa();
    }

    return true;
  }
}
