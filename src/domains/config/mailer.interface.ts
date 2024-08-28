export interface MailerConfig {
  getMailerHost(): string;
  getMailerPort(): number;
  getMailerUser(): string;
  getMailerPassword(): string;
  getMailerFrom(): string;
  getResetPasswordLink(): string;
}
