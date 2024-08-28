import { EnvironmentConfigModule } from '@infrastructures/config/environment-config/environment-config.module';
import { UnitOfWorkModule } from '@infrastructures/unit-of-work/unit-of-work.module';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@shared/guards';
import { JwtStrategy } from '@infrastructures/strategies/jwt.strategy';
import { UserAccountRepository } from '@infrastructures/repositories/user-account.repository';
import { EnvironmentConfigService } from '@infrastructures/config/environment-config/environment-config.service';
import { JWTConfig } from '@domains/config/jwt.interface';
import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';
import { JwtRefreshTokenStrategy } from '@infrastructures/strategies/jwtRefresh.strategy';

@Module({
  imports: [EnvironmentConfigModule, JwtModule, UnitOfWorkModule, RepositoriesModule],
  providers: [
    JwtTokenService,
    {
      inject: [UserAccountRepository, EnvironmentConfigService],
      provide: JwtStrategy,
      useFactory: (userAccountRepository: UserAccountRepository, config: JWTConfig) =>
        new JwtStrategy(userAccountRepository, config),
    },
    {
      inject: [UserAccountRepository, JwtTokenService, EnvironmentConfigService],
      provide: JwtRefreshTokenStrategy,
      useFactory: (
        userAccountRepository: UserAccountRepository,
        jwtTokenSerivce: JwtTokenService,
        config: EnvironmentConfigService,
      ) => new JwtRefreshTokenStrategy(userAccountRepository, jwtTokenSerivce, config),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtTokenService],
})
@Global()
export class JwtTokenModule {}
