import { DataSource, EntityManager, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IBlacklistTokenRepository } from '@domains/repositories/blacklist-token-repository.interface';
import { BlacklistTokenEntity } from '@infrastructures/entities/blacklist-token.entity';
import { BlacklistToken } from '@domains/entities';

@Injectable()
export class BlacklistTokenRepository implements IBlacklistTokenRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {}

  get blacklistTokenRepository(): Repository<BlacklistTokenEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(BlacklistTokenEntity);
    }
    return this.dataSource.getRepository(BlacklistTokenEntity);
  }

  async findByToken(token: string): Promise<BlacklistToken> {
    const entity = await this.blacklistTokenRepository.findOneBy({
      token,
    });

    if (!entity) return null;
    return entity.toModel();
  }

  async deleteExpiredToken(userAccountId: number): Promise<void> {
    const now = new Date();
    await this.blacklistTokenRepository
      .createQueryBuilder()
      .delete()
      .where('user_account_id = :userAccountId', { userAccountId })
      .andWhere('expiredAt < :now', { now })
      .execute();
  }

  async createBlacklistTokens(
    dtos: Pick<BlacklistToken, 'userAccountId' | 'token' | 'expiredAt'>[],
  ): Promise<BlacklistToken[]> {
    const entities = await this.blacklistTokenRepository.save(dtos);

    return entities.map((e) => e.toModel());
  }

  async createBlacklistToken(
    dto: Pick<BlacklistToken, 'userAccountId' | 'token' | 'expiredAt'>,
  ): Promise<BlacklistToken> {
    const entity = await this.blacklistTokenRepository.save(dto);

    return entity.toModel();
  }

  getEntityManager(): EntityManager {
    return this.blacklistTokenRepository.manager;
  }
}
