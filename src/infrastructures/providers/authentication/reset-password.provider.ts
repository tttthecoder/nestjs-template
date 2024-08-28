import { ResetPasswordUseCases } from '@applications/usecase/authentication';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { JwtTokenService } from '@infrastructures/services/jwt-token/jwt.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const ResetPasswordProvider = {
  inject: [UnitOfWork, JwtTokenService],
  provide: UsecasesProxyProvide.ResetPasswordUseCase,
  useFactory: (unitOfWork: UnitOfWork, jwtTokenService: JwtTokenService) =>
    new UseCaseProxy(new ResetPasswordUseCases(unitOfWork, jwtTokenService)),
};
