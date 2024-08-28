import { ILogger } from '@domains/logger/logger.interface';
import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    // const config = {
    //   datePattern: 'YYYY-MM-DD',
    //   maxSize: '20m',
    //   maxFiles: '14d',
    //   format: winston.format.combine(
    //     winston.format.timestamp({
    //       format: 'YYYY-MM-DD HH:mm:ss S',
    //     }),
    //     winston.format.json(),
    //   ),
    // };
    // const transportError = new winston.transports.DailyRotateFile({
    //   level: 'error',
    //   filename: 'logs/error-%DATE%.log',
    //   ...config,
    // });
    // const transportInfo = new winston.transports.DailyRotateFile({
    //   filename: 'logs/info-%DATE%.log',
    //   ...config,
    // });
    // this.logger = winston.createLogger({
    //   transports: [new winston.transports.Console(), transportError, transportInfo],
    // });
    super();
  }

  log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
  }
  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }
  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }
  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }
}
