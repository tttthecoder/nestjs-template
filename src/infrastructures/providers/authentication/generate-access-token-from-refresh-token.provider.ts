import { GenerateAccessTokenFromRefreshTokenUseCase } from '@applications/usecase/authentication';
import { EnvironmentConfigService } from '@infrastructures/config/environment-config/environment-config.service';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { JwtTokenService } from '@infrastructures/services/jwt-token/jwt.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const GenerateAccessTokenFromRefreshTokenProvider = {
  inject: [UnitOfWork, EnvironmentConfigService, JwtTokenService],
  provide: UsecasesProxyProvide.GenerateAccessTokenFromRefreshTokenUseCase,
  useFactory: (unitOfWork: UnitOfWork, config: EnvironmentConfigService, jwtTokenService: JwtTokenService) =>
    new UseCaseProxy(new GenerateAccessTokenFromRefreshTokenUseCase(unitOfWork, config, jwtTokenService)),
};
