import { LoggerService } from '@infrastructures/logging/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception?.getStatus ? exception.getStatus() : 400;

    const exceptionResponse = exception?.getResponse
      ? (exception.getResponse() as {
          message: string;
          error: string;
          statusCode: string;
        })
      : {
          message: 'Bad Request',
        };

    this.logMessage(request, exceptionResponse.message, status, exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().getTime(),
      path: request.url,
      error: exceptionResponse.message,
    });
  }

  private logMessage(request: any, message: string, status: number, exception: any) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${message} message=${message ? message : null}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${message} message=${message ? message : null}`,
      );
    }
  }
}
