import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { OrderDirection, PropertyType } from '@shared/common/enums';

export const ApiPaginatedRequest = <TEntity extends Type<any>>(entity: TEntity) => {
  const entityInstance = new entity();
  const entityOrderKeys: string[] = Reflect.getMetadata(PropertyType.Order, entityInstance) || [];
  const entitySearchKeys: string[] = Reflect.getMetadata(PropertyType.Search, entityInstance) || [];

  return applyDecorators(
    ApiQuery({
      name: 'orderBy',
      enum: entityOrderKeys,
      required: false,
      description: `Ordering items by entity's field`,
    }),
    ApiQuery({
      name: 'orderDirection',
      enum: OrderDirection,
      required: false,
      description: 'Ordering items by ascending or descending direction',
    }),
    ApiQuery({ name: 'page', type: 'number', required: false, example: '1', description: 'Index of page' }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
      example: '20',
      description: 'The number of limited items for each page',
    }),
    ApiQuery({
      name: 'searchBy',
      enum: entitySearchKeys,
      required: false,
      description: `Search items by entity's field`,
    }),
    ApiQuery({ name: 'searchValue', type: 'string', required: false, description: 'Value of the search field' }),
  );
};
