import { LogoutUseCases } from '@applications/usecase/authentication';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { JwtTokenService } from '@infrastructures/services/jwt-token/jwt.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const LogoutProvider = {
  inject: [JwtTokenService, UnitOfWork],
  provide: UsecasesProxyProvide.LogoutUsecase,
  useFactory: (jwtTokenService: JwtTokenService, unitOfWork: UnitOfWork) =>
    new UseCaseProxy(new LogoutUseCases(jwtTokenService, unitOfWork)),
};
