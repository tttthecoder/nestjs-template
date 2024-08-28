import { EmailStatus, UserPosition } from 'src/domains/common/user-login-data';

export class UserLoginData {
  id: number;
  uuid: string;
  userAccountId: number;
  passwordHash: string;
  email: string;
  emailStatus: EmailStatus;
  passwordRecoveryToken: string;
  confirmationToken: string;
  isTwoFactorEnabled: boolean;
  isTwoFactorVerified: boolean;
  twoFactorSecret: string;
  userPosition: UserPosition;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  // userAccount: UserAccountModel;
}
