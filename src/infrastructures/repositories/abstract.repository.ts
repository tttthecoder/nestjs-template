import { IAbstractRepository } from '@domains/repositories/abstract.repository';
import { StringHelper } from 'src/shared/helpers/string.helper';
import { SelectQueryBuilder } from 'typeorm';

export abstract class AbstractRepository<TEntity> implements IAbstractRepository<SelectQueryBuilder<TEntity>> {
  public applySearchFilters(
    query: SelectQueryBuilder<TEntity>,
    search: Record<string, any>,
  ): SelectQueryBuilder<TEntity> {
    if (Boolean(search)) {
      for (const [key, value] of Object.entries(search)) {
        const snakeCaseKey = StringHelper.camelToSnakeCase(key);
        query = query.andWhere(`${snakeCaseKey} like :${key}`, { [key]: `%${value}%` });
      }
    }
    return query;
  }

  public applyParamFilters(
    query: SelectQueryBuilder<TEntity>,
    params: Record<string, any>,
  ): SelectQueryBuilder<TEntity> {
    if (Boolean(params)) {
      for (const [key, value] of Object.entries(params)) {
        const snakeCaseKey = StringHelper.camelToSnakeCase(key);
        query = query.andWhere(`${snakeCaseKey} = :${key}`, { [key]: value });
      }
    }
    return query;
  }

  public applyOrder(query: SelectQueryBuilder<TEntity>, order: Record<string, any>): SelectQueryBuilder<TEntity> {
    if (Boolean(order)) {
      for (const [field, direction] of Object.entries(order)) {
        const snakeCaseField = StringHelper.camelToSnakeCase(field);
        query = query.orderBy(`${snakeCaseField}`, direction);
      }
    }
    return query;
  }
}
