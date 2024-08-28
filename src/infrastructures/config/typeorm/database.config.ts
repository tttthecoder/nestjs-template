/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: `${process.env.DB_HOST}`,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  entities: ['dist/infrastructures/entities/*.entity.js'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'history',
  migrations: ['dist/database/migrations/**/*.js'],
  seedTracking: true,
  seeds: ['dist/database/seeds/**/*{.ts,.js}'],
  factories: ['dist/database/factories/**/*{.ts,.js}'],
};

export const AppDataSource = new DataSource(options);
