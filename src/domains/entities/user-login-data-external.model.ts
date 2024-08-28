import { Provider } from 'src/domains/common/user-login-data-external';

export class UserLoginDataExternal {
  id: number;
  uuid: string;
  userAccountId: number;
  socialId: string;
  provider: Provider;
  token: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  // userAccount: UserAccountModel;
}
