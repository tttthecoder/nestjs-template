import { RegisterUserRequestDto } from '@applications/dtos/authentication/register-user-request.dto';
import { UserAccount } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { HashHelper } from '@shared/helpers';

export class RegisterUseCases implements UseCase<RegisterUserRequestDto, UserAccount> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  public async execute(dto: RegisterUserRequestDto): Promise<UserAccount> {

    const userAccountModel = await this.unitOfWork.getUserAccountRepository().createUserAccountWithLoginData({
      userAccount: {
        ...dto.userAccount,
      },
      userLogin: {
        ...dto.userLogin,
        passwordHash: await HashHelper.encrypt(dto.userLogin.password),
      },
    });

    return userAccountModel;
  }
}
