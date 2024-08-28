import { CreateResetPasswordLinkRequestDto } from '@applications/dtos/authentication/create-reset-password-link-request.dto';
import { IJwtService } from '@domains/adapters/jwt.interface';
import { JWTConfig } from '@domains/config/jwt.interface';
import { MailerConfig } from '@domains/config/mailer.interface';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '@shared/dtos';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class ForgotPasswordUseCases implements UseCase<CreateResetPasswordLinkRequestDto, SuccessResponseDto> {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly config: JWTConfig & MailerConfig,
    private readonly jwtTokenService: IJwtService,
  ) {}

  public async execute({ email }: CreateResetPasswordLinkRequestDto): Promise<SuccessResponseDto> {
    const userAccount = await this.unitOfWork.getUserAccountRepository().findOneByEmail(email);

    if (!userAccount) {
      throw new NotFoundException('Email not found');
    }

    const token = await this.generateResetPasswordToken(userAccount.uuid);

    // !Todo: Send
    await Promise.all([
      this.unitOfWork.getUserLoginDataRepository().updatePasswordRecoveryToken(email, token),
      // this.unitOfWork.getOutboxRepository().createOutbox({
      //   content: {
      //     to: email,
      //     subject: 'Welcome to Our App! Please confirm your Email',
      //     template: './confirmation',
      //     context: {
      //       name: `${userAccount.firstName} ${userAccount.lastName}`,
      //       url: `${this.config.getResetPasswordLink()}?token=${token}`,
      //     },
      //   },
      //   exchange: DEFAULT_EXCHANGE_NAME,
      //   routingKey: MAIL_ROUTING_KEY,
      // }),
    ]);

    return {
      result: true,
    };
  }

  private async generateResetPasswordToken(uuid: string) {
    const expiresIn: string = this.config.getJwtPasswordExpirationTime();
    const secret = this.config.getJwtPasswordSecret();
    const payload = { uuid };
    const token = this.jwtTokenService.createPasswordToken(payload, secret, expiresIn);
    return token;
  }
}
