import { Notification } from '@domains/entities/notification.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'notification' })
export class NotificationEntity extends Notification {
  constructor(notification?: Partial<NotificationEntity>) {
    super();
    Object.assign(this, notification);
  }

  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid' })
  transactionId: string;

  @Column({
    name: 'is_sent',
    type: 'boolean',
    default: false,
  })
  isSent: boolean;

  @Column({
    name: 'is_handle',
    type: 'boolean',
    default: false,
  })
  isHandled: boolean;

  @Column({
    name: 'is_error',
    type: 'boolean',
    default: false,
  })
  isError: boolean;

  @Column({
    name: 'exchange',
    type: 'varchar',
    length: 32,
    default: '',
  })
  exchange: string;

  @Column({
    name: 'routing_key',
    type: 'varchar',
    length: 32,
    default: '',
  })
  routingKey: string;

  @Column({
    name: 'payload',
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  toModel() {
    const model = new Notification();
    model.id = this.id;
    model.createdAt = this.baseEntity.createdAt;
    model.createdAt = this.baseEntity.createdAt;
    model.createdAt = this.baseEntity.createdAt;
    model.content = this.content;
    model.exchange = this.exchange;
    model.isError = this.isError;
    model.isHandled = this.isHandled;
    model.isSent = this.isSent;
    model.routingKey = this.routingKey;
    model.transactionId = this.transactionId;
    return model;
  }
}
