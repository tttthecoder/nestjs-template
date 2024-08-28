import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserLoginDataExternalEntity } from './user-login-data-external.entity';
import { Gender, UserAccountStatus } from 'src/domains/common/user-account';
import { UserLoginDataEntity } from './user-login-data.entity';
import { BaseEntity } from './base.entity';
import { UserAccount } from '@domains/entities';
import { BlacklistTokenEntity } from './blacklist-token.entity';
import { UserTokenEntity } from './user-token.entity';

@Entity({ name: 'user_account', schema: 'asean-hr-training' })
export class UserAccountEntity extends UserAccount {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid' })
  uuid: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  lastName: string;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    nullable: true,
    default: null,
  })
  gender: Gender;

  @Column({
    name: 'date_of_birth',
    type: 'datetime',
    default: null,
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 15,
    default: null,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: 'avatar',
  })
  avatar: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserAccountStatus,
    nullable: false,
    default: UserAccountStatus.Inactive,
  })
  status: UserAccountStatus;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  // Relationship
  @OneToMany(() => UserLoginDataExternalEntity, (userLoginExternal) => userLoginExternal.userAccount)
  userLoginExternals: UserLoginDataExternalEntity[];

  @OneToOne(() => UserLoginDataEntity, (userLoginData) => userLoginData.userAccount)
  userLoginData: UserLoginDataEntity;

  @OneToMany(() => BlacklistTokenEntity, (token) => token.user)
  blacklistedTokens: BlacklistTokenEntity[];

  @OneToMany(() => UserTokenEntity, (token) => token.user)
  tokens: UserTokenEntity[];

  toModel(): UserAccount {
    const model = new UserAccount();
    model.id = this.id;
    model.avatar = this.avatar;
    model.createdAt = this.baseEntity.createdAt;
    model.deletedAt = this.baseEntity.deletedAt;
    model.updatedAt = this.baseEntity.updatedAt;
    model.dateOfBirth = this.dateOfBirth;
    model.firstName = this.firstName;
    model.gender = this.gender;
    model.lastName = this.lastName;
    model.phoneNumber = this.phoneNumber;
    model.status = this.status;
    // model.userLoginData = entity.userLoginData;
    // model.userLoginExternals = entity.userLoginExternals;
    model.uuid = this.uuid;
    return model;
  }
}
