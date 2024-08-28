import { TypeOrmConfigModule } from '@infrastructures/config/typeorm/typeorm.module';
import { Module } from '@nestjs/common';
import { UserAccountRepository } from './user-account.repository';
import { UserLoginDataRepository } from './user-login-data.repository';
import { BlacklistTokenRepository } from './blacklist-token.repository';
import { UserTokenRepository } from './user-token.repository';
import { NotificationRepository } from './notification.repository';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [TypeOrmConfigModule],
  providers: [
    UserAccountRepository,
    UserLoginDataRepository,
    BlacklistTokenRepository,
    UserTokenRepository,
    NotificationRepository,
    OtpRepository,
  ],
  exports: [
    UserAccountRepository,
    UserLoginDataRepository,
    BlacklistTokenRepository,
    UserTokenRepository,
    NotificationRepository,
    OtpRepository,
  ],
})
export class RepositoriesModule {}
