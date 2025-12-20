import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../../../querying/dto/pagination.dto';
import { ProductFilterDto } from './filter-products.dto';
import { ProductSortDto } from './products-sort.dto';

export class ProductsQueryDto extends IntersectionType(
  PaginationDto,
  ProductFilterDto,
  ProductSortDto,
) {}
