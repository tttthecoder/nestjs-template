import * as moment from 'moment';
import { FORMAT_DATE, FORMAT_DATETIME, FORMAT_TIME } from '@shared/common/constants';
import { BadRequestException } from '@nestjs/common';

export class FormatHelper {
  static formatDate(datetime?: Date): string {
    if (!datetime) return 'null';
    return moment(datetime).format(FORMAT_DATE);
  }

  static formatDatetime(datetime?: Date): string {
    if (!datetime) return 'null';
    return moment(datetime).format(FORMAT_DATETIME);
  }

  static formatTime(datetime?: Date): string {
    if (!datetime) return 'null';
    return moment(datetime).format(FORMAT_TIME);
  }

  static formatKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const snakeCaseObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        snakeCaseObj[snakeCaseKey] = obj[key];
      }
    }
    return snakeCaseObj;
  }

  static formatValuesToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const snakeCaseObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        snakeCaseObj[key] =
          typeof obj[key] === 'string' ? obj[key].replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`) : obj[key];
      }
    }
    return snakeCaseObj;
  }

  static stringToBoolean(value: string): boolean {
    switch (value.toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case null:
      case undefined:
        return false;
      default:
        throw new BadRequestException(`Cannot convert string "${value}" to boolean.`);
    }
  }
}
