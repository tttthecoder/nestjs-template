import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

export type DataSourceName = string | 'default';

export const isDataSource = (value: unknown): value is DataSource => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return value.constructor.name === DataSource.name;
};

export const addTransactionalDataSource = (dataSource: DataSource) => {
  dataSources.set(dataSource?.name ? dataSource.name : 'default', dataSource);
  dataSource['@transactional/data-source'] = dataSource?.name ? dataSource.name : 'default';

  return dataSource;
};

export const storage = new AsyncLocalStorage<Map<string, EntityManager>>();
export const dataSources = new Map<DataSourceName, DataSource>();

@Module({
  providers: [{ useValue: storage, provide: 'LocalStorage' }],
  exports: ['LocalStorage'],
})
@Global()
export class LocalStorageModule {}
