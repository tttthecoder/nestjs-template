import { RegisterVerifyOtpDto } from '@applications/dtos/authentication/regiter-verify.dto copy';
import { UserAccountStatus } from '@domains/common/user-account';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { BadRequestException } from '@nestjs/common';
import { OtpUseCase } from '@shared/common/enums';
import { SuccessResponseDto } from '@shared/dtos';
import { OtpExpiredException, OtpInvalidException } from '@shared/exceptions';

export class VerifyOtpUseCases implements UseCase<RegisterVerifyOtpDto, SuccessResponseDto> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(input: RegisterVerifyOtpDto): Promise<SuccessResponseDto> {
    const { email, otp } = input;

    const userAccountEntity = await this.unitOfWork.getUserAccountRepository().findOneByEmail(email);

    if (userAccountEntity.status != UserAccountStatus.Inactive) {
      throw new BadRequestException('User is activated or blocked');
    }

    const otps = await this.unitOfWork.getOtpRepository().getActiveOtps(userAccountEntity.id, OtpUseCase.Register);

    if (otps.length === 0) {
      throw new OtpExpiredException();
    }

    const indexOtpValid = otps.findIndex((otpEntry) => otpEntry.code === otp);

    if (indexOtpValid === -1) {
      throw new OtpInvalidException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, result] = await Promise.all([
      this.unitOfWork.getOtpRepository().deactiveOtp(otps[indexOtpValid].id),
      this.unitOfWork.getUserAccountRepository().updateStatus(userAccountEntity.id, UserAccountStatus.Active),
    ]);

    return {
      result,
    };
  }
}
