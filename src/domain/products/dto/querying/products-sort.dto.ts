import { IsIn, IsOptional } from 'class-validator';

const Sort = ['name', 'price'] as const;
type Sort = (typeof Sort)[number];

const Order = ['ASC', 'DESC'] as const;
type Order = (typeof Order)[number];

export class ProductSortDto {
  @IsOptional()
  @IsIn(Sort)
  readonly sort?: Sort = 'name';

  @IsOptional()
  @IsIn(Order)
  readonly order?: Order = 'ASC';
}
