import { UserAccountStatus } from '@domains/common/user-account';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LoginGuard implements CanActivate {
  /**
   * Verify if user is super user
   * @param context {ExecutionContext}
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, hasVerify2FA } = context.switchToHttp().getRequest();

    if (user.isTwoFAEnable && !hasVerify2FA) {
      return false;
    }

    return user.status === UserAccountStatus.Active;
  }
}
