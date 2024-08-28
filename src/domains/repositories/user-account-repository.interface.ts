import { UserAccount, UserLoginData } from '@domains/entities';

export interface IUserAccountRepository {
  getEntityManager(): unknown;

  findOneByEmail(email: string): Promise<UserAccount | null>;

  findOneByUUID(uuid: string): Promise<UserAccount | null>;

  createUserAccountWithLoginData(dto: {
    userLogin: Partial<UserLoginData>;
    userAccount: Partial<UserAccount>;
  }): Promise<UserAccount>;
}
