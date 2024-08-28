import { Gender, UserAccountStatus } from 'src/domains/common/user-account';
import { UserLoginDataExternal } from './user-login-data-external.model';
import { UserLoginData } from './user-login-data.model';
import { UserToken } from './user-token.model';

export class UserAccount {
  constructor(data?: Partial<UserAccount>) {
    Object.assign(this, { ...data });
  }
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  phoneNumber: string;
  avatar: string;
  status: UserAccountStatus;
  companyId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  userLoginExternals: UserLoginDataExternal[];
  userLoginData: UserLoginData;
  tokens: UserToken[];
}
