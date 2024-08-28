import { UserTokenType } from '@domains/common/token';
import { UserToken } from '@domains/entities';
import { IUserTokenRepository } from '@domains/repositories/user-token-repository.interface';
import { UserTokenEntity } from '@infrastructures/entities/user-token.entity';
import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserTokenRepository implements IUserTokenRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: Pick<UserToken, 'token' | 'type' | 'userAccountId'>): Promise<UserToken | null> {
    const entity = await this.userTokenEntityRepository.save(dto);

    return entity?.toModel();
  }

  async creates(dtos: Pick<UserToken, 'token' | 'type' | 'userAccountId'>[]): Promise<UserToken[]> {
    const entity = await this.userTokenEntityRepository.save(dtos);

    return entity.map((e) => e?.toModel());
  }

  async getUserTokenListByUserAccountId(id: number, type?: UserTokenType): Promise<UserToken[]> {
    return await this.getTokensByUserAccountId(id, type);
  }

  async getUserTokenByUserAccountId(id: number, type?: UserTokenType): Promise<UserToken> {
    return await this.getTokenByUserAccountId(id, type);
  }

  async updateUserToken(model: UserToken): Promise<boolean> {
    const result = await this.userTokenEntityRepository.update(
      {
        userAccountId: model.userAccountId,
        ...(model?.type ? { type: model.type } : {}),
      },
      {
        token: model.token,
        expiredAt: model.expiredAt,
      },
    );
    return !!result.affected;
  }

  get userTokenEntityRepository(): Repository<UserTokenEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(UserTokenEntity);
    }
    return this.dataSource.getRepository(UserTokenEntity);
  }

  getEntityManager(): EntityManager {
    return this.userTokenEntityRepository.manager;
  }

  private async getTokensByUserAccountId(id: number, type?: UserTokenType): Promise<UserToken[]> {
    const entities = await this.userTokenEntityRepository.find({
      where: {
        userAccountId: id,
        ...(type ? { type } : {}), // Apply filter only if type is provided
      },
    });

    if (entities.length === 0) return [];

    return entities.map((e) => e?.toModel());
  }

  private async getTokenByUserAccountId(id: number, type?: UserTokenType): Promise<UserToken> {
    const entity = await this.userTokenEntityRepository.findOne({
      where: {
        userAccountId: id,
        ...(type ? { type } : {}), // Apply filter only if type is provided
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }
}
