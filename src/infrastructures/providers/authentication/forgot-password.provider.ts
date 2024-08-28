import { ForgotPasswordUseCases } from "@applications/usecase/authentication";
import { EnvironmentConfigService } from "@infrastructures/config/environment-config/environment-config.service";
import { UsecasesProxyProvide } from "@infrastructures/enums";
import { JwtTokenService } from "@infrastructures/services/jwt-token/jwt.service";
import { UnitOfWork } from "@infrastructures/unit-of-work/unit-of-work.service";
import { UseCaseProxy } from "@infrastructures/usecase-proxy/usecases-proxy";

export const ForgotPasswordProvider = {
  inject: [UnitOfWork, EnvironmentConfigService, JwtTokenService],
  provide: UsecasesProxyProvide.ForgotPasswordUseCase,
  useFactory: (unitOfWork: UnitOfWork, config: EnvironmentConfigService, jwtTokenService: JwtTokenService) =>
    new UseCaseProxy(new ForgotPasswordUseCases(unitOfWork, config, jwtTokenService)),
};
