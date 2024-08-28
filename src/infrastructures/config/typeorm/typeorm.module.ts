import { DatabaseConfig } from 'src/domains/config/database.interface';
import { EnvironmentConfigModule } from 'src/infrastructures/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructures/config/environment-config/environment-config.service';
import { addTransactionalDataSource } from 'src/infrastructures/local-storage/local-storage.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const getTypeOrmModuleOptions = (config: DatabaseConfig): TypeOrmModuleOptions =>
  ({
    type: 'mysql',
    // host: config.getDatabaseHost(),
    // port: config.getDatabasePort(),
    // username: config.getDatabaseUser(),
    // password: config.getDatabasePassword(),
    // database: config.getDatabaseName(),
    entities: ['dist/infrastructures/entities/**/*.entity.js'],
    logging: process.env.NODE_ENV === 'local' ? true : false,
    synchronize: false,
    migrationsRun: false,
    schema: config.getDatabaseSchema(),
    migrations: ['dist/database/migrations/**/*.js'],
    migrationsTableName: 'history',
    seedTracking: true,
    replication: {
      master: {
        host: config.getDatabaseHost(),
        port: config.getDatabasePort(),
        username: config.getDatabaseUser(),
        password: config.getDatabasePassword(),
        database: config.getDatabaseName(),
      },
      slaves: [
        {
          host: config.getDatabaseHost(),
          port: config.getDatabasePort(),
          username: config.getDatabaseUser(),
          password: config.getDatabasePassword(),
          database: config.getDatabaseName(),
        },
      ],
    },
    seeds: ['dist/database/seeds/**/*{.ts,.js}'],
    factories: ['dist/database/factories/**/*{.ts,.js}'],
    autoLoadEntities: true,
  }) as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
      dataSourceFactory: async (options) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([
      // ...
    ]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
