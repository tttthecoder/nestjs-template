import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_ROUTE_PREFIX, APP_VERSION, BODY_SIZE_LIMIT } from '@shared/common/constants';
import { BadRequestException, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationError } from 'class-validator';
import { SwaggerConfig } from 'src/infrastructures/config/swagger/swagger.config';
import { HttpExceptionFilter } from '@shared/filters/exceptions/http-exception.filter';
import { HttpResponseInterceptor } from '@shared/interceptors/response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .setGlobalPrefix(AppModule.apiPrefix || APP_ROUTE_PREFIX)
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: AppModule.apiVersion || APP_VERSION,
    })
    .enableCors({
      origin: ['*'],
      credentials: true,
    });

  app
    .use(helmet())
    .use(compression())
    .use(bodyParser.json({ limit: BODY_SIZE_LIMIT }))
    .use(bodyParser.urlencoded({ limit: BODY_SIZE_LIMIT, extended: true }))
    .useGlobalFilters(new HttpExceptionFilter(AppModule.logger))
    // .useGlobalInterceptors(new LoggingInterceptor(AppModule.logger))
    .useGlobalInterceptors(new HttpResponseInterceptor(AppModule.mode))
    .useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          const formatError = (error: ValidationError) => {
            if (error.children?.length) {
              return {
                field: error.property,
                errors: error.children.map(formatError),
              };
            }
            return {
              field: error.property,
              errors: Object.values(error.constraints ?? {}),
            };
          };
          return new BadRequestException(errors.map((error) => formatError(error)));
        },
        stopAtFirstError: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

  SwaggerConfig(app, AppModule.apiPrefix || APP_ROUTE_PREFIX);
  // Setting port for application
  await app.listen(AppModule.port, '0.0.0.0');
  return AppModule.port;
}
bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
