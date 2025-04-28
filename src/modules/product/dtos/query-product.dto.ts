import { IsIn, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  OrderByQuery,
  SortOrderQuery,
  sortByValues,
  orderByValues,
} from 'src/types';

export class QueryProductDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsIn(sortByValues)
  sortOrder: SortOrderQuery;

  @IsOptional()
  @IsIn(orderByValues)
  orderBy: OrderByQuery;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  page: number;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(20)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  limit: number;
}
