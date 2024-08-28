import { AuthCredentialsRequestDto } from '@applications/dtos/authentication/auth-credentials-request.dto';
import { CreateResetPasswordLinkRequestDto } from '@applications/dtos/authentication/create-reset-password-link-request.dto';
import { GenerateAccessTokenFromRefreshTokenRequestDto } from '@applications/dtos/authentication/generate-access-token-from-refresh-token-request.dto';
import { RegisterUserRequestDto } from '@applications/dtos/authentication/register-user-request.dto';
import { ResetPasswordRequestDto } from '@applications/dtos/authentication/reset-password-request.dto';
import { TokenDto } from '@applications/dtos/authentication/token.dto';
import { ValidateTokenRequestDto } from '@applications/dtos/authentication/validate-token-request.dto';
import { UserAccountResponseDto } from '@applications/dtos/user-account/user-account-response.dto';
import { UserAccountMapper } from '@presentations/mapper/user-account.mapper';
import { UserAccount } from '@domains/entities';
import { UseCase } from '@domains/usecase/usecase.interface';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { Body, Controller, HttpCode, Inject, Post, Request, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiGlobalResponse, CurrentUser, SkipAuth, SkipTwoFA } from '@shared/decorators';
import { SuccessResponseDto } from '@shared/dtos';
import { LoginResponseDto } from '@applications/dtos/authentication/login-response.dto';
import { TOKEN_NAME } from '@infrastructures/config/swagger/swagger.config';
import { JwtPayload } from '@domains/adapters/jwt.interface';
import JwtRefreshGuard from '@shared/decorators/jwt-refresh-guard';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(
    @Inject(UsecasesProxyProvide.LoginUsecase)
    private readonly loginUsecase: UseCaseProxy<
      UseCase<AuthCredentialsRequestDto, { user: UserAccount; token: TokenDto; refreshTokenCookie: string }>
    >,
    @Inject(UsecasesProxyProvide.RegisterUseCase)
    private readonly registerUseCase: UseCaseProxy<UseCase<RegisterUserRequestDto, UserAccount>>,
    @Inject(UsecasesProxyProvide.ForgotPasswordUseCase)
    private readonly forgotPasswordUseCases: UseCaseProxy<
      UseCase<CreateResetPasswordLinkRequestDto, SuccessResponseDto>
    >,
    @Inject(UsecasesProxyProvide.ResetPasswordUseCase)
    private readonly resetPasswordUseCases: UseCaseProxy<UseCase<ResetPasswordRequestDto, SuccessResponseDto>>,
    @Inject(UsecasesProxyProvide.VerifyRecoveryTokenUseCase)
    private readonly verifyRecoveryTokenUseCases: UseCaseProxy<UseCase<ValidateTokenRequestDto, SuccessResponseDto>>,
    @Inject(UsecasesProxyProvide.LogoutUsecase)
    private readonly logoutUsecases: UseCaseProxy<UseCase<UserAccount, SuccessResponseDto>>,
    @Inject(UsecasesProxyProvide.GenerateAccessTokenFromRefreshTokenUseCase)
    private readonly generateAccessTokenFromRefreshTokenUseCase: UseCaseProxy<
      UseCase<{ user: UserAccount; payload: JwtPayload }, TokenDto>
    >,
  ) {}

  @ApiGlobalResponse(UserAccountResponseDto)
  @ApiOperation({ description: 'User Register' })
  @Post('/register')
  @HttpCode(200)
  @SkipAuth()
  @SkipTwoFA()
  public async register(@Body(ValidationPipe) registerDto: RegisterUserRequestDto): Promise<UserAccountResponseDto> {
    const userAccount = await this.registerUseCase.getInstance().execute(registerDto);
    return UserAccountMapper.toDto(userAccount);
  }

  @ApiGlobalResponse(LoginResponseDto)
  @ApiOperation({ description: 'User authentication' })
  @Post('/login')
  @HttpCode(200)
  @SkipAuth()
  @SkipTwoFA()
  public async login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsRequestDto,
    @Request() request: any,
  ): Promise<LoginResponseDto> {
    const { refreshTokenCookie, ...data } = await this.loginUsecase.getInstance().execute(authCredentialsDto);

    request.res.setHeader('Set-Cookie', [refreshTokenCookie]);

    return {
      token: data.token,
      user: UserAccountMapper.toDto(data.user),
    };
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'Create Link Reset Password and Send Email' })
  @Post('/reset-password/create')
  @HttpCode(200)
  @SkipAuth()
  @SkipTwoFA()
  public async resetPasswordCreate(
    @Body(ValidationPipe)
    passwordLinkRequestDto: CreateResetPasswordLinkRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.forgotPasswordUseCases.getInstance().execute(passwordLinkRequestDto);
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'Validate Link Reset Password' })
  @Post('/reset-password/validate-token')
  @HttpCode(200)
  @SkipAuth()
  @SkipTwoFA()
  public async validateResetPasswordToken(
    @Body(ValidationPipe) validateTokenRequestDto: ValidateTokenRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.verifyRecoveryTokenUseCases.getInstance().execute(validateTokenRequestDto);
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'Reset Password' })
  @Post('/reset-password/process')
  @HttpCode(200)
  @SkipAuth()
  @SkipTwoFA()
  public async resetPassword(
    @Body(ValidationPipe) resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.resetPasswordUseCases.getInstance().execute(resetPasswordRequestDto);
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'User Logout' })
  @ApiBearerAuth(TOKEN_NAME)
  @Post('/logout')
  @HttpCode(200)
  public async logout(@CurrentUser() user: UserAccount, @Request() request: any): Promise<SuccessResponseDto> {
    const cookie = await this.logoutUsecases.getInstance().execute(user);
    request.res.setHeader('Set-Cookie', [cookie]);
    return {
      result: true,
    };
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'User refresh token' })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  @ApiOkResponse({ description: 'token successfully renewed' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @SkipAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('/token/refresh')
  @HttpCode(200)
  public async refreshToken(@Request() request: any): Promise<TokenDto> {
    return await this.generateAccessTokenFromRefreshTokenUseCase
      .getInstance()
      .execute({ user: request.user, payload: request.jwtPayload });
  }
}
