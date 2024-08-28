import { TypeOrmConfigModule } from '@infrastructures/config/typeorm/typeorm.module';
import { Module } from '@nestjs/common';
import { UserAccountRepository } from './user-account.repository';
import { UserLoginDataRepository } from './user-login-data.repository';
import { BlacklistTokenRepository } from './blacklist-token.repository';
import { UserTokenRepository } from './user-token.repository';

@Module({
  imports: [TypeOrmConfigModule],
  providers: [UserAccountRepository, UserLoginDataRepository, BlacklistTokenRepository, UserTokenRepository],
  exports: [UserAccountRepository, UserLoginDataRepository, BlacklistTokenRepository, UserTokenRepository],
})
export class RepositoriesModule {}
