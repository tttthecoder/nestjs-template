import { IBlacklistTokenRepository } from '@domains/repositories/blacklist-token-repository.interface';
import { INotificationRepository } from '@domains/repositories/notification-repository.interface';
import { IOtpRepository } from '@domains/repositories/otp-repository.interface';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { IUserLoginDataRepository } from '@domains/repositories/user-login-data-repository.interface';
import { IUserTokenRepository } from '@domains/repositories/user-token-repository.interface';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { BlacklistTokenRepository } from '@infrastructures/repositories/blacklist-token.repository';
import { NotificationRepository } from '@infrastructures/repositories/notification.repository';
import { OtpRepository } from '@infrastructures/repositories/otp.repository';
import { UserAccountRepository } from '@infrastructures/repositories/user-account.repository';
import { UserLoginDataRepository } from '@infrastructures/repositories/user-login-data.repository';
import { UserTokenRepository } from '@infrastructures/repositories/user-token.repository';
import { Inject } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

export class UnitOfWork implements IUnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('LocalStorage')
    private readonly _asyncLocalStorage: AsyncLocalStorage<any>,
    @Inject(UserAccountRepository)
    private readonly userAccountRepository: IUserAccountRepository,
    @Inject(UserLoginDataRepository)
    private readonly userLoginDataRepository: IUserLoginDataRepository,
    @Inject(BlacklistTokenRepository)
    private readonly blacklistTokenRepository: IBlacklistTokenRepository,
    @Inject(UserTokenRepository)
    private readonly userTokenRepository: IUserTokenRepository,
    @Inject(OtpRepository)
    private readonly otpRepository: IOtpRepository,
    @Inject(NotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}
  getOtpRepository(): IOtpRepository {
    return this.otpRepository;
  }
  getNotificationRepository(): INotificationRepository {
    return this.notificationRepository;
  }
  getUserTokenRepository(): IUserTokenRepository {
    return this.userTokenRepository;
  }
  getBlacklistTokenRepository(): IBlacklistTokenRepository {
    return this.blacklistTokenRepository;
  }
  getUserAccountRepository(): IUserAccountRepository {
    return this.userAccountRepository;
  }
  getUserLoginDataRepository(): IUserLoginDataRepository {
    return this.userLoginDataRepository;
  }

  private getDataSource(): DataSource {
    return this.dataSource;
  }

  async doTransactional<W>(work: () => W | Promise<W>): Promise<W> {
    const queryRunner = this.getDataSource().createQueryRunner('master');
    return await this._asyncLocalStorage.run(new Map<string, EntityManager>(), async () => {
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        this._asyncLocalStorage.getStore().set('typeOrmEntityManager', queryRunner.manager);
        const result: W = await work();
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    });
  }

  getTransactionManager(): unknown {
    const storage = this._asyncLocalStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager');
    }
    return null;
  }
}
