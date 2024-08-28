import { BadRequestException, createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { PropertyType } from '@shared/common/enums';
import { DefaultPagination } from '@shared/pagination';
import { PaginationDto } from '@shared/pagination/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = <TEntity extends Type<any>>(entity: TEntity) => {
  const entityInstance = new entity();
  const entityOrderKeys: string[] = Reflect.getMetadata(PropertyType.Order, entityInstance) || [];
  const entitySearchKeys: string[] = Reflect.getMetadata(PropertyType.Search, entityInstance) || [];

  return createParamDecorator(
    (
      data: DefaultPagination = {
        defaultSkip: 0,
        defaultPage: 0,
        defaultLimit: 10,
        defaultOrder: {},
        defaultOrderDirection: 'ASC',
        defaultSearch: {},
        defaultSearchValue: '',
        maxAllowedSize: 50,
      },
      ctx: ExecutionContext,
    ) => {
      const {
        query: { orderBy, orderDirection, searchBy, searchValue, ...params },
      } = ctx.switchToHttp().getRequest();
      // eslint-disable-next-line prefer-const
      let { skip, page, limit, ...leftParams } = params;

      const {
        defaultSkip,
        defaultPage,
        defaultLimit,
        defaultOrder,
        defaultOrderDirection,
        maxAllowedSize,
        defaultSearch,
        defaultSearchValue,
      } = data;

      // Create and validate a PaginationDto instance
      const paginationDto = plainToInstance(PaginationDto, {
        skip: !skip ? undefined : +skip,
        page: +page,
        limit: +limit,
        orderBy,
        orderDirection,
        searchBy,
        searchValue,
      });
      const errors = validateSync(paginationDto);
      if (paginationDto.orderBy && !entityOrderKeys.includes(paginationDto.orderBy)) {
        errors.push({
          property: 'orderBy',
          constraints: {
            isEnum: `orderBy must be one of the following values: ${entityOrderKeys.join(', ')}`,
          },
        });
      }
      if (paginationDto.searchBy && !entitySearchKeys.includes(paginationDto.searchBy)) {
        errors.push({
          property: 'searchBy',
          constraints: {
            isEnum: `searchBy must be one of the following values: ${entityOrderKeys.join(', ')}`,
          },
        });
      }
      if (errors.length > 0) {
        throw new BadRequestException(
          errors.map((error) => ({ field: error.property, errors: Object.values(error.constraints ?? {}) })),
        );
      }

      const order = orderBy ? { [orderBy]: orderDirection ? orderDirection : defaultOrderDirection } : defaultOrder;

      const search = searchBy ? { [searchBy]: searchValue ? searchValue : defaultSearchValue } : defaultSearch;

      limit = limit && limit >= 0 ? +limit : defaultLimit;

      if (!skip) {
        if (page) {
          skip = (+page - 1) * +limit;
          skip = skip >= 0 ? skip : 0;
        } else {
          page = defaultPage;
          skip = defaultSkip;
        }
      } else {
        page = Math.floor(+skip / limit);
      }

      limit = +limit < +maxAllowedSize ? limit : maxAllowedSize;
      return Object.assign(data ? data : {}, {
        skip,
        page,
        limit,
        order,
        search,
        params: leftParams,
      });
    },
  )();
};
