import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/dtos';

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly mode: string) {}

  /**
   * Intercept the request and add the timestamp
   * @param context {ExecutionContext}
   * @param next {CallHandler}
   * @returns { payload:Response<T>, timestamp: string }
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    const contextType = context.getType<'http' | 'rmq'>();

    if (contextType === 'rmq') {
      return next.handle();
    }

    if (this.mode === 'local' && context.switchToHttp().getRequest().url === '/api') {
      return next.handle();
    }

    const timestamp = new Date().getTime();
    return next.handle().pipe(
      map((payload) => {
        return { payload, timestamp };
      }),
    );
  }
}
