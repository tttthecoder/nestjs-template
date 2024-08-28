import { BlacklistToken } from '@domains/entities';

export interface IBlacklistTokenRepository {
  getEntityManager(): any;

  createBlacklistToken(dto: Pick<BlacklistToken, 'userAccountId' | 'expiredAt' | 'token'>): Promise<BlacklistToken>;

  createBlacklistTokens(
    dtos: Pick<BlacklistToken, 'userAccountId' | 'expiredAt' | 'token'>[],
  ): Promise<BlacklistToken[]>;

  deleteExpiredToken(userAccountId: number): Promise<void>;

  findByToken(token: string): Promise<BlacklistToken>;
}
