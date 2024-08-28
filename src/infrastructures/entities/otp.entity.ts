import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccountEntity } from './user-account.entity';
import { Otp } from '@domains/entities/otp.model';
import { OtpUseCase } from '@shared/common/enums';
import { BaseEntity } from './base.entity';

@Entity({ name: 'otps' })
export class OtpEntity extends Otp {
  constructor(otp?: Partial<OtpEntity>) {
    super(otp);
    Object.assign(this, otp);
  }

  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column({ name: 'user_account_id', type: 'bigint' })
  userAccountId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 6,
  })
  code: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ type: 'enum', nullable: false, enum: OtpUseCase })
  type: OtpUseCase;

  @Column({
    name: 'expires_at',
    type: 'datetime',
    precision: null,
    nullable: false,
  })
  expiresAt: Date;

  @ManyToOne(() => UserAccountEntity, (user) => user.id)
  @JoinColumn({ name: 'user_account_id' })
  owner: UserAccountEntity;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  toModel(): Otp {
    const model = new Otp();
    model.id = this.id;
    model.active = this.active;
    model.createdAt = this.baseEntity?.createdAt;
    model.updatedAt = this.baseEntity?.updatedAt;
    model.deletedAt = this.baseEntity?.deletedAt;
    model.code = this.code;
    model.owner = this?.owner?.toModel();
    model.type = this.type;
    model.expiresAt = this.expiresAt;
    model.userAccountId = this.userAccountId;
    return model;
  }
}
