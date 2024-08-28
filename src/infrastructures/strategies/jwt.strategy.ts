import { JwtPayload } from '@domains/adapters/jwt.interface';
import { UserAccountStatus } from '@domains/common/user-account';
import { JWTConfig } from '@domains/config/jwt.interface';
import { UserAccount } from '@domains/entities';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ErrorType } from '@shared/common/enums';
import { DisabledUserException, InvalidCredentialsException } from '@shared/exceptions';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userAccountRepository: IUserAccountRepository,
    private readonly jwtConfig: JWTConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload): Promise<UserAccount> {
    const { uuid } = payload;

    const userAccount = await this.userAccountRepository.findOneByUUID(uuid);

    if (!userAccount) {
      throw new InvalidCredentialsException();
    }
    if (userAccount.status == UserAccountStatus.Inactive) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }
    if (userAccount.status == UserAccountStatus.Blocked) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }
    return userAccount;
  }
}
