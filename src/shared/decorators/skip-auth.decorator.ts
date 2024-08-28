import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH } from './decorator.constant';

export const SkipAuth = (skipping: boolean = true) => SetMetadata(SKIP_AUTH, skipping);
