import { SetMetadata } from '@nestjs/common';
import { SKIP_2FA } from './decorator.constant';

export const SkipTwoFA = (skipping: boolean = true) => SetMetadata(SKIP_2FA, skipping);
