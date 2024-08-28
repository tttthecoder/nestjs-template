import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { DynamicModule, Module } from '@nestjs/common';
import { EmailSenderService } from './mailer.service';
import { EnvironmentConfigModule } from '@infrastructures/config/environment-config/environment-config.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerConfig } from '@domains/config/mailer.interface';
import { join } from 'path';
import { EnvironmentConfigService } from '@infrastructures/config/environment-config/environment-config.service';

@Module({
  imports: [
    EnvironmentConfigModule,
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (config: MailerConfig) => ({
        transport: {
          host: config.getMailerHost(),
          port: config.getMailerPort(),
          secure: false,
          auth: {
            user: config.getMailerUser(),
            pass: config.getMailerPassword(),
          },
        },
        defaults: {
          from: `"No Reply" <${config.getMailerFrom()}>`,
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: join(__dirname, '/templates'),
            options: {
              strict: true,
            },
          },
        },
        verifyTransporters: true,
      }),
      inject: [EnvironmentConfigService],
    }),
  ],
})
export class EmailSenderModule {
  static register(): DynamicModule {
    return {
      module: EmailSenderModule,
      providers: [
        {
          inject: [MailerService, EnvironmentConfigService],
          provide: EmailSenderService,
          useFactory: (mailerService: MailerService, mailerConfig: EnvironmentConfigService) =>
            new EmailSenderService(mailerService, mailerConfig),
        },
      ],
      exports: [EmailSenderService],
    };
  }
}
