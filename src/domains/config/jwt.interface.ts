export interface JWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): string;
  getJwtType(): string;
  getJwtPasswordExpirationTime(): string;
  getJwtPasswordSecret(): string;
}
