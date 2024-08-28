import { LogoutUseCases } from '@applications/usecase/authentication';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const LogoutProvider = {
  inject: [UnitOfWork],
  provide: UsecasesProxyProvide.LogoutUsecase,
  useFactory: (unitOfWork: UnitOfWork) => new UseCaseProxy(new LogoutUseCases(unitOfWork)),
};
