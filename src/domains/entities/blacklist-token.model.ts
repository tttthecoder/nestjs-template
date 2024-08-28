import { UserAccount } from './user-account.model';

export class BlacklistToken {
  id: number;
  userAccountId: number;
  token: string;
  expiredAt: Date;
  user: UserAccount;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
