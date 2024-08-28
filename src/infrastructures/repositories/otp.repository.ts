import { IOtpRepository } from '@domains/repositories/otp-repository.interface';
import { OtpEntity } from '@infrastructures/entities/otp.entity';
import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager, LessThan, MoreThanOrEqual } from 'typeorm';
import { AbstractRepository } from './abstract.repository';
import { Otp } from '@domains/entities';
import { OtpUseCase } from '@shared/common/enums';

@Injectable()
export class OtpRepository extends AbstractRepository<OtpEntity> implements IOtpRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  get otpEntityRepository() {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(OtpEntity);
    }
    return this.dataSource.getRepository(OtpEntity);
  }

  getEntityManager(): EntityManager {
    return this.otpEntityRepository.manager;
  }

  async createOtp(dto: Pick<Otp, 'code' | 'expiresAt' | 'type' | 'userAccountId'>): Promise<Otp> {
    const entity = await this.otpEntityRepository.save(new OtpEntity({ ...dto }));

    return entity.toModel();
  }

  async deactiveOtp(id: number): Promise<boolean> {
    const result = await this.otpEntityRepository.update(
      {
        id,
      },
      {
        active: false,
      },
    );
    return !!result?.affected;
  }

  async deactiveAllOtps(userAccountId: number, type: OtpUseCase): Promise<boolean> {
    const result = await this.otpEntityRepository.update(
      {
        userAccountId,
        type,
      },
      {
        active: false,
      },
    );
    return !!result?.affected;
  }

  async getActiveOtps(userAccountId: number, type: OtpUseCase): Promise<Otp[]> {
    const entities = await this.otpEntityRepository.find({
      where: {
        type,
        expiresAt: MoreThanOrEqual(new Date()),
        userAccountId,
        active: true,
      },
    });

    if (entities.length === 0) return [];

    return entities.map((e) => e.toModel());
  }

  async deleteExpiredOtp(): Promise<void> {
    await this.otpEntityRepository.delete({
      expiresAt: LessThan(new Date(Date.now() - 1000 * 60)),
    });
  }
}
