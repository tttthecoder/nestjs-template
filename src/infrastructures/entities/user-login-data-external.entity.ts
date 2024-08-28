import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccountEntity } from './user-account.entity';
import { BaseEntity } from './base.entity';
import { Provider } from 'src/domains/common/user-login-data-external';
import { UserLoginDataExternal } from '@domains/entities';

@Entity({ name: 'user_login_data_external', schema: 'asean-hr-training' })
export class UserLoginDataExternalEntity extends UserLoginDataExternal {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid' })
  uuid: string;

  @Column({ name: 'user_account_id', type: 'bigint' })
  userAccountId: number;

  @Column({
    name: 'social_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  socialId: string;

  @Column({
    name: 'provider',
    type: 'enum',
    enum: Provider,
    nullable: true,
  })
  provider: Provider;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 2048,
    nullable: false,
  })
  token: string;

  @Column({
    name: 'expired_at',
    type: 'datetime',
    precision: null,
    nullable: false,
  })
  expiredAt: Date;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  // Relationship

  @ManyToOne(() => UserAccountEntity, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccountEntity;

  constructor(userLoginDataExternal?: Partial<UserLoginDataExternalEntity>) {
		super();
    Object.assign(this, userLoginDataExternal);
  }
}
