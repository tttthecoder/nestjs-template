import { Notification } from '@domains/entities';
import { INotificationRepository } from '@domains/repositories/notification-repository.interface';
import { NotificationEntity } from '@infrastructures/entities/notification.entity';
import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {}

  get notificationEntityRepository(): Repository<NotificationEntity> {
    const storage = this.localStorage.getStore();

    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(NotificationEntity);
    }

    return this.dataSource.getRepository(NotificationEntity);
  }

  getEntityManager(): EntityManager {
    return this.notificationEntityRepository.manager;
  }

  async findAllQueuingNotifications(): Promise<Notification[]> {
    const entities = await this.notificationEntityRepository
      .createQueryBuilder()
      .where(`is_error = :isError`, { isError: false })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`is_sent = :isSentConditionFirst`, { isSentConditionFirst: false }).orWhere(
            new Brackets((qb2) => {
              qb2
                .where(`is_sent = :isSentConditionSecond`, { isSentConditionSecond: true })
                .andWhere(` is_handle = :isHandle `, { isHandle: false });
            }),
          );
        }),
      )
      .getMany();

    return entities.map((e) => e.toModel());
  }

  async findOneByTransactionId(transactionId: string): Promise<Notification> {
    const entity = await this.notificationEntityRepository.findOne({ where: { transactionId } });

    if (!entity) return null;

    return entity.toModel();
  }

  async markAsSent(transactionId: string): Promise<boolean> {
    const result = await this.notificationEntityRepository.update(
      { transactionId, isSent: false, isError: false },
      { isSent: true },
    );

    return !!result.affected;
  }

  async markAsError(transactionId: string): Promise<boolean> {
    const result = await this.notificationEntityRepository.update({ transactionId }, { isError: true });

    return !!result.affected;
  }

  async markAsHandled(transactionId: string): Promise<boolean> {
    const result = await this.notificationEntityRepository.update(
      { transactionId, isHandled: false, isError: false },
      { isHandled: true },
    );
    return !!result.affected;
  }

  async createNotification(dto: Pick<Notification, 'content' | 'exchange' | 'routingKey'>): Promise<boolean> {
    const result = await this.notificationEntityRepository.save(new NotificationEntity({ ...dto }));

    return !!result;
  }

  async updateNotification(id: number, dto: Partial<Notification>): Promise<boolean> {
    const result = await this.notificationEntityRepository.update({ id }, { ...dto });

    return !!result.affected;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await this.notificationEntityRepository.delete({ id });

    return !!result.affected;
  }
}
