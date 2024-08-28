import { RegisterUseCases } from '@applications/usecase/authentication';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const RegisterProvider = {
  inject: [UnitOfWork],
  provide: UsecasesProxyProvide.RegisterUseCase,
  useFactory: (unitOfWork: UnitOfWork) => new UseCaseProxy(new RegisterUseCases(unitOfWork)),
};
