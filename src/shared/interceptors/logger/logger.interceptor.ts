import { LoggerService } from '@infrastructures/logging/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const contextType = context.getType<'http' | 'rmq'>();

    if (contextType === 'rmq') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const ip = this.getIP(request);
    const userAgent = this.getUserAgent(request);

    this.logger.log(`Incoming Request on ${request.path}`, `method=${request.method} ip=${ip} user-agent=${userAgent}`);

    return next.handle().pipe();
  }

  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.connection.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }

  private getUserAgent(request: any): string {
    const headers = request.headers;
    const userAgent = headers['user-agent'];
    return userAgent;
  }
}
