import { OtpUseCase } from '@shared/common/enums';
import { UserAccount } from './user-account.model';

export class Otp {
  constructor(data?: Partial<Otp>) {
    Object.assign(this, { ...data });
  }
  id: number;
  userAccountId: number;
  code: string;
  active: boolean;
  type: OtpUseCase;
  expiresAt: Date;
  owner: UserAccount;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
