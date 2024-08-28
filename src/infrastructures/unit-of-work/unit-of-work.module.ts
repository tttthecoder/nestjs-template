import { Module } from '@nestjs/common';
import { UnitOfWork } from './unit-of-work.service';
import { TypeOrmConfigModule } from '@infrastructures/config/typeorm/typeorm.module';
import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';

@Module({
  imports: [TypeOrmConfigModule, RepositoriesModule],
  exports: [UnitOfWork],
  providers: [UnitOfWork],
})
export class UnitOfWorkModule {}
