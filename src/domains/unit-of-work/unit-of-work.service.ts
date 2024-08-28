import { IBlacklistTokenRepository } from '@domains/repositories/blacklist-token-repository.interface';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { IUserLoginDataRepository } from '@domains/repositories/user-login-data-repository.interface';
import { IUserTokenRepository } from '@domains/repositories/user-token-repository.interface';

export interface IUnitOfWork {
  doTransactional<W>(work: () => W | Promise<W>): Promise<W>;
  getTransactionManager(): unknown;

  // Repository
  getUserAccountRepository(): IUserAccountRepository;
  getUserLoginDataRepository(): IUserLoginDataRepository;
  getUserTokenRepository(): IUserTokenRepository;
  getBlacklistTokenRepository(): IBlacklistTokenRepository;
}
