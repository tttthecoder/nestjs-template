import { Otp } from '@domains/entities/otp.model';
import { OtpUseCase } from '@shared/common/enums';

export interface IMailerService<T> {
  /**
   * Gets the email title based on the OTP type.
   *
   * @param otpType The OTP type.
   * @returns The email title.
   */
  getOtpEmailSubject(otpType: OtpUseCase): string;

  /**
   * Sends an OTP email.
   */
  buildOtpEmailConfig(email: string, recipientName: string, otp: Otp, otpLifetime: any): Promise<T> | T;

  /**
   * Sends a user confirmation email.
   *
   * @param token The confirmation token.
   * @param user The user account entity.
   */
  buildUserConfirmationEmailConfig(email: string, recipientName: string, confirmationToken: string): Promise<T> | T;
}
