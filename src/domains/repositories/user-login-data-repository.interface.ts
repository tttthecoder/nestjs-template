import { UserLoginData } from '@domains/entities';

export interface IUserLoginDataRepository {
  getEntityManager(): unknown;

  createUserLoginData(dto: Pick<UserLoginData, 'email' | 'passwordHash' | 'userAccountId'>): Promise<UserLoginData>;

  findByEmail(email: string): Promise<UserLoginData | null>;

  updatePasswordRecoveryToken(email: string, token: string): Promise<boolean>;

  updateUserLoginData(userLoginData: UserLoginData): Promise<boolean>;
}
