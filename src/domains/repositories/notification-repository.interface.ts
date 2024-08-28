import { Notification } from '@domains/entities';

export interface INotificationRepository {
  getEntityManager(): any;

  findAllQueuingNotifications(): Promise<Notification[]>;

  findOneByTransactionId(transactionId: string): Promise<Notification | null>;

  markAsSent(transactionId: string): Promise<boolean>;

  markAsError(transactionId: string): Promise<boolean>;

  markAsHandled(transactionId: string): Promise<boolean>;

  createNotification(dto: Pick<Notification, 'content' | 'exchange' | 'routingKey'>): Promise<boolean>;

  updateNotification(id: number, dto: Partial<Notification>): Promise<boolean>;

  deleteNotification(id: number): Promise<boolean>;
}
