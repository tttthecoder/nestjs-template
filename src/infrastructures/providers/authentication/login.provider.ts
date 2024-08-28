import { LoginUseCases } from '@applications/usecase/authentication';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { JwtTokenService } from '@infrastructures/services/jwt-token/jwt.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const LoginProvider = {
  inject: [UnitOfWork, JwtTokenService],
  provide: UsecasesProxyProvide.LoginUsecase,
  useFactory: (unitOfWork: UnitOfWork, jwtTokenService: JwtTokenService) =>
    new UseCaseProxy(new LoginUseCases(unitOfWork, jwtTokenService)),
};
