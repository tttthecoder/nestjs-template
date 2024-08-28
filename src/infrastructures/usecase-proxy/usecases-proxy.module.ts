import { EnvironmentConfigModule } from '@infrastructures/config/environment-config/environment-config.module';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { LoggerModule } from '@infrastructures/logging/logger.module';
import {
  ForgotPasswordProvider,
  GenerateAccessTokenFromRefreshTokenProvider,
  LoginProvider,
  LogoutProvider,
  RegisterProvider,
  ResetPasswordProvider,
  VerifyRecoveryTokenProvider,
} from '@infrastructures/providers/authentication';
import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';
import { UnitOfWorkModule } from '@infrastructures/unit-of-work/unit-of-work.module';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [LoggerModule, JwtModule, EnvironmentConfigModule, RepositoriesModule, UnitOfWorkModule],
})
@Global()
export class UsecasesProxyModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: UsecasesProxyModule,
      providers: [
        // authentication
        LoginProvider,
        RegisterProvider,
        ForgotPasswordProvider,
        ResetPasswordProvider,
        VerifyRecoveryTokenProvider,
        LogoutProvider,
        GenerateAccessTokenFromRefreshTokenProvider,
      ],
      exports: [
        // authentication
        UsecasesProxyProvide.LoginUsecase,
        UsecasesProxyProvide.RegisterUseCase,
        UsecasesProxyProvide.ForgotPasswordUseCase,
        UsecasesProxyProvide.ResetPasswordUseCase,
        UsecasesProxyProvide.VerifyRecoveryTokenUseCase,
        UsecasesProxyProvide.LogoutUsecase,
        UsecasesProxyProvide.GenerateAccessTokenFromRefreshTokenUseCase,
      ],
    };
  }
}
