import { DatabaseConfig } from 'src/domains/config/database.interface';
import { JWTConfig } from 'src/domains/config/jwt.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerConfig } from '@domains/config/mailer.interface';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig, MailerConfig {
  constructor(private configService: ConfigService) {}
  // Mailer
  getMailerFrom(): string {
    return this.configService.get<string>('MAIL_FROM');
  }
  getMailerHost(): string {
    return this.configService.get<string>('MAIL_HOST');
  }
  getMailerPort(): number {
    return parseInt(this.configService.get<string>('MAIL_PORT'));
  }
  getMailerUser(): string {
    return this.configService.get<string>('MAIL_USER');
  }
  getMailerPassword(): string {
    return this.configService.get<string>('MAIL_PASSWORD');
  }
  getResetPasswordLink(): string {
    return this.configService.get<string>('RESET_PASSWORD_LINK');
  }

  // Config ENV JWT
  getJwtSecret(): string {
    return this.configService.get<string>('ACCESS_TOKEN_SECRET');
  }
  getJwtExpirationTime(): string {
    return this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN');
  }
  getJwtRefreshSecret(): string {
    return this.configService.get<string>('REFRESH_TOKEN_SECRET');
  }
  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN');
  }
  getJwtType(): string {
    return this.configService.get<string>('TOKEN_TYPE');
  }
  getJwtPasswordExpirationTime(): string {
    return this.configService.get<string>('RESET_PASSWORD_LINK_EXPIRES_IN');
  }
  getJwtPasswordSecret(): string {
    return this.configService.get<string>('RESET_PASSWORD_SECRET');
  }
  getJwtRefreshCookieKey(): string {
    return this.configService.get<string>('REFRESH_TOKEN_COOKIE_KEY');
  }
  getJwtRefreshTokenCookieMaxAge(): string {
    return this.configService.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE');
  }

  // Config ENV database
  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDatabasePort(): number {
    return parseInt(this.configService.get<string>('DB_PORT'));
  }
  getDatabaseUser(): string {
    return this.configService.get<string>('DB_USERNAME');
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DB_DATABASE');
  }
  getDatabaseSchema(): string {
    return this.configService.get<string>('DB_SCHEMA');
  }
}
