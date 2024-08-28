import { UserLoginDataEntity } from '@infrastructures/entities/user-login-data.entity';
import { Inject, Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { IUserLoginDataRepository } from '@domains/repositories/user-login-data-repository.interface';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserLoginData } from '@domains/entities';

@Injectable()
export class UserLoginDataRepository
  extends AbstractRepository<UserLoginDataEntity>
  implements IUserLoginDataRepository
{
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createUserLoginData(
    dto: Pick<UserLoginData, 'email' | 'passwordHash' | 'userAccountId'>,
  ): Promise<UserLoginData> {
    const entity = await this.userLoginDataRepository.save(dto);

    return entity?.toModel();
  }

  async findByEmail(email: string): Promise<UserLoginData> {
    const entity = await this.userLoginDataRepository.findOne({
      where: {
        email,
        baseEntity: {
          deletedAt: null,
        },
      },
    });

    return entity?.toModel();
  }

  async updatePasswordRecoveryToken(email: string, token: string): Promise<boolean> {
    const result = await this.userLoginDataRepository.update(
      {
        email,
      },
      {
        passwordRecoveryToken: token,
      },
    );
    return !!result.affected;
  }

  async updateUserLoginData(userLoginData: UserLoginData): Promise<boolean> {
    const result = await this.userLoginDataRepository.update(
      {
        id: userLoginData.id,
      },
      {
        passwordHash: userLoginData.passwordHash,
        emailStatus: userLoginData.emailStatus,
        passwordRecoveryToken: userLoginData.passwordRecoveryToken,
        confirmationToken: userLoginData.confirmationToken,
        isTwoFactorEnabled: userLoginData.isTwoFactorEnabled,
        isTwoFactorVerified: userLoginData.isTwoFactorVerified,
        twoFactorSecret: userLoginData.twoFactorSecret,
      },
    );

    return !!result.affected;
  }

  get userLoginDataRepository(): Repository<UserLoginDataEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(UserLoginDataEntity);
    }
    return this.dataSource.getRepository(UserLoginDataEntity);
  }

  getEntityManager(): EntityManager {
    return this.userLoginDataRepository.manager;
  }
}
