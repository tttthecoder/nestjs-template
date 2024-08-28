import { OrderDirection } from '@shared/common/enums';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  orderBy?: string;

  @ValidateIf((dto) => dto.orderBy !== null && dto.orderBy !== undefined && dto.orderBy !== '')
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;

  @IsOptional()
  searchBy?: string;

  @ValidateIf((dto) => dto.searchBy !== null && dto.searchBy !== undefined && dto.searchBy !== '')
  @IsOptional()
  @IsString()
  searchValue?: string;
}
