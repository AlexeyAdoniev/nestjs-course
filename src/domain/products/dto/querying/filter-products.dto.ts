import { IsCurrency, IsOptional, ValidateNested } from 'class-validator';
import { NameFilterDto } from '../../../../querying/dto/name-filter.dto';
import { IsCardinal } from '../../../../common/decorators/validators/is-cardinal.decorator';
import { ToFilterOperationDto } from '../../../../querying/decorators/to-filter-operation-dto.decorator';
import { FilterOperatorDto } from '../../../../querying/dto/filter-operation.dto';

export class ProductFilterDto extends NameFilterDto {
  @IsOptional()
  @ValidateNested()
  @ToFilterOperationDto()
  readonly price?: FilterOperatorDto;
  @IsOptional()
  @IsCardinal()
  readonly category?: number;
}
