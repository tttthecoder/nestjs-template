import { UserAccountStatus } from '@domains/common/user-account';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { BadRequestException } from '@nestjs/common';
import { OtpUseCase } from '@shared/common/enums';
import { SuccessResponseDto } from '@shared/dtos';
import { TooManyRequestException } from '@shared/exceptions';

export class SendOtpUseCases implements UseCase<string, SuccessResponseDto> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(input: string): Promise<SuccessResponseDto> {
    const userAccountModel = await this.unitOfWork.getUserAccountRepository().findOneByEmail(input);

    if (userAccountModel.status != UserAccountStatus.Inactive) {
      throw new BadRequestException('User is activated or blocked');
    }
    const opt = await this.unitOfWork.getOtpRepository().getActiveOtps(userAccountModel.id, OtpUseCase.Register);

    if (opt.length > 0) {
      throw new TooManyRequestException();
    }
    // TODO: deactive older otp
    await this.unitOfWork.getOtpRepository().deactiveAllOtps(userAccountModel.id, OtpUseCase.Register);

    const code = this.generateOtpCode(6);
    const lifetime: number = 2;
    const expiresAt = new Date(Date.now() + 1000 * 60 * lifetime); // minutes after now

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otpEntity = await this.unitOfWork.getOtpRepository().createOtp({
      code: code,
      expiresAt: expiresAt,
      userAccountId: userAccountModel.id,
      type: OtpUseCase.Register,
    });

    // !TODO: Send Otp to user: email or sms
    // await this.unitOfWork.getNotificationRepository().createNotification({
    // content: {
    //   to: userAccountModel.userLoginData.email,
    //   subject: 'Thank to use our app! This is your otp',
    //   template: './sendotp',
    //   context: {
    //     title: 'Please use this OTP to verify your account',
    //     name: `${userAccountModel.firstName} ${userAccountModel.lastName}`,
    //     otp: otpEntity.code,
    //     lifetime,
    //   },
    // },
    // exchange: DEFAULT_EXCHANGE_NAME,
    // routingKey: MAIL_ROUTING_KEY,
    // });

    return {
      result: true,
    };
  }

  private generateOtpCode(n: number): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < n; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
  }
}
