import { Otp } from '@domains/entities';
import { OtpUseCase } from '@shared/common/enums';

export interface IOtpRepository {
  getEntityManager(): any;

  createOtp(dto: Pick<Otp, 'code' | 'expiresAt' | 'type' | 'userAccountId'>): Promise<Otp>;

  deactiveOtp(id: number): Promise<boolean>;

  deactiveAllOtps(userAccountId: number, type: OtpUseCase): Promise<boolean>;

  getActiveOtps(userAccountId: number, type: OtpUseCase): Promise<Otp[]>;

  deleteExpiredOtp(): Promise<void>;
}
