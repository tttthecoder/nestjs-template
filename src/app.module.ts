import { EnvironmentConfigModule } from 'src/infrastructures/config/environment-config/environment-config.module';
import { TypeOrmConfigModule } from 'src/infrastructures/config/typeorm/typeorm.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ControllerModule } from './presentations/controller/controller.module';
import { UnitOfWorkModule } from '@infrastructures/unit-of-work/unit-of-work.module';
import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';
import { LocalStorageModule } from '@infrastructures/local-storage/local-storage.module';
import { JwtTokenModule } from '@infrastructures/services/jwt-token/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { LoggerService } from '@infrastructures/logging/logger.service';
import { LoggerModule } from '@infrastructures/logging/logger.module';
import { UsecasesProxyModule } from '@infrastructures/usecase-proxy/usecases-proxy.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmConfigModule,
    ControllerModule,
    RepositoriesModule,
    UnitOfWorkModule,
    LocalStorageModule,
    PassportModule,
    JwtTokenModule,
    LoggerModule,
    UsecasesProxyModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number;
  static mode: string;
  static apiVersion: string;
  static apiPrefix: string;
  static logger: LoggerService;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    AppModule.logger = logger;
    AppModule.port = +this.configService.get('API_PORT');
    AppModule.mode = this.configService.get('APP_MODE');
    AppModule.apiVersion = this.configService.get('API_VERSION');
    AppModule.apiPrefix = this.configService.get('API_PREFIX');
  }
}
