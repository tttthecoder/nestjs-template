import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class ControllerModule {}
