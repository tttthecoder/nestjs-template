import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccountEntity } from './user-account.entity';
import { BaseEntity } from './base.entity';
import { EmailStatus, UserPosition } from 'src/domains/common/user-login-data';
import { UserLoginData } from '@domains/entities';

@Entity({ name: 'user_login_data' })
export class UserLoginDataEntity extends UserLoginData {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid' })
  uuid: string;

  @Column({ name: 'user_account_id', type: 'bigint' })
  userAccountId: number;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  passwordHash: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'email_status',
    type: 'enum',
    enum: EmailStatus,
    nullable: true,
    default: EmailStatus.Pending,
  })
  emailStatus: EmailStatus;

  @Column({
    name: 'password_recovery_token',
    type: 'varchar',
    length: 1024,
    nullable: true,
    default: null,
  })
  passwordRecoveryToken: string;

  @Column({
    name: 'confirmation_token',
    type: 'varchar',
    length: 1024,
    nullable: true,
    default: null,
  })
  confirmationToken: string;

  @Column({
    name: 'is_two_factor_enabled',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isTwoFactorEnabled: boolean;

  @Column({
    name: 'is_two_factor_verified',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isTwoFactorVerified: boolean;

  @Column({
    name: 'two_factor_secret',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  twoFactorSecret: string;

  @Column({
    name: 'user_position',
    type: 'enum',
    enum: UserPosition,
    nullable: false,
    default: UserPosition.USER,
  })
  userPosition: UserPosition;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  // Relationship
  @OneToOne(() => UserAccountEntity, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccountEntity;

  // Constructor
  constructor(userLoginData?: Partial<UserLoginDataEntity>) {
    super();
    Object.assign(this, userLoginData);
  }

  public toModel(): UserLoginData {
    const model = new UserLoginData();
    model.id = this.id;
    model.confirmationToken = this.confirmationToken;
    model.createdAt = this.baseEntity.createdAt;
    model.updatedAt = this.baseEntity.updatedAt;
    model.deletedAt = this.baseEntity.deletedAt;
    model.email = this.email;
    model.emailStatus = this.emailStatus;
    model.isTwoFactorEnabled = this.isTwoFactorEnabled;
    model.isTwoFactorVerified = this.isTwoFactorVerified;
    model.passwordHash = this.passwordHash;
    model.passwordRecoveryToken = this.passwordRecoveryToken;
    model.twoFactorSecret = this.twoFactorSecret;
    model.userAccountId = this.userAccountId;
    model.userPosition = this.userPosition;
    model.uuid = this.uuid;

    return model;
  }
}
