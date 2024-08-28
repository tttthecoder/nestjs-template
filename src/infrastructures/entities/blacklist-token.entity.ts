import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccountEntity } from './user-account.entity';
import { BaseEntity } from './base.entity';
import { BlacklistToken } from '@domains/entities';

@Entity({ name: 'blacklist_token' })
export class BlacklistTokenEntity {
  constructor(blacklistToken?: Partial<BlacklistTokenEntity>) {
    Object.assign(this, blacklistToken);
  }

  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column({ name: 'user_account_id', type: 'bigint' })
  userAccountId: number;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  token: string;

  @Column({
    name: 'expired_at',
    type: 'datetime',
    precision: null,
    nullable: false,
  })
  expiredAt: Date;

  @ManyToOne(() => UserAccountEntity, (user) => user.blacklistedTokens)
  @JoinColumn({ name: 'user_account_id' })
  user: UserAccountEntity;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  public toModel(): BlacklistToken {
    const model = new BlacklistToken();
    model.id = this.id;
    model.token = this.token;
    model.userAccountId = this.userAccountId;
    model.expiredAt = this.expiredAt;
    model.createdAt = this?.baseEntity.createdAt;
    model.updatedAt = this?.baseEntity.updatedAt;
    model.deletedAt = this?.baseEntity.deletedAt;
    model.user = this?.user?.toModel();
    return model;
  }
}
