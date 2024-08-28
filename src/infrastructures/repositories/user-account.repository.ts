import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { UserAccountEntity } from '@infrastructures/entities/user-account.entity';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserAccount, UserLoginData } from '@domains/entities';
import { UserLoginDataEntity } from '@infrastructures/entities/user-login-data.entity';
import { UserAccountStatus } from '@domains/common/user-account';

@Injectable()
export class UserAccountRepository extends AbstractRepository<UserAccountEntity> implements IUserAccountRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async updateStatus(id: number, status: UserAccountStatus): Promise<boolean> {
    const result = await this.userAccountEntityRepository.update(
      {
        id,
      },
      {
        status,
      },
    );

    return !!result.affected;
  }

  async createUserAccountWithLoginData(dto: {
    userLogin: Partial<UserLoginData>;
    userAccount: Partial<UserAccount>;
  }): Promise<UserAccount> {
    let userAccount = new UserAccount();
    let userLoginData = new UserLoginData();

    await this.userAccountEntityRepository.manager.transaction(async (transactionalEntityManager) => {
      const user = await this.findOneByEmail(dto.userLogin.email);

      if (!!user) {
        throw new BadRequestException('Email is already in use');
      }
      const userAccountEntity = (await transactionalEntityManager.save(
        new UserAccountEntity({ ...dto.userAccount }),
      )) as UserAccountEntity;

      dto.userLogin.userAccountId = userAccountEntity.id;

      const userLoginDataEntity = (await transactionalEntityManager.save(
        new UserLoginDataEntity({ ...dto.userLogin }),
      )) as UserLoginDataEntity;

      userAccount = userAccountEntity.toModel();
      userLoginData = userLoginDataEntity.toModel();
    });

    userAccount.userLoginData = userLoginData;

    return userAccount;
  }

  async findOneByUUID(uuid: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        uuid,
      },
      relations: {
        userLoginData: true,
        userLoginExternals: true,
        tokens: true,
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }

  async findOneByEmail(email: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        userLoginData: {
          email,
        },
      },
      relations: {
        userLoginData: true,
        userLoginExternals: true,
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }

  get userAccountEntityRepository(): Repository<UserAccountEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(UserAccountEntity);
    }
    return this.dataSource.getRepository(UserAccountEntity);
  }

  getEntityManager(): EntityManager {
    return this.userAccountEntityRepository.manager;
  }
}
