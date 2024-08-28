import { UserAccountStatus } from '@domains/common/user-account';
import { UserAccount, UserLoginData } from '@domains/entities';

export interface IUserAccountRepository {
  getEntityManager(): unknown;

  findOneByEmail(email: string): Promise<UserAccount | null>;

  findOneByUUID(uuid: string): Promise<UserAccount | null>;

  createUserAccountWithLoginData(dto: {
    userLogin: Partial<UserLoginData>;
    userAccount: Partial<UserAccount>;
  }): Promise<UserAccount>;

  updateStatus(id: number, status: UserAccountStatus): Promise<boolean>;
}
