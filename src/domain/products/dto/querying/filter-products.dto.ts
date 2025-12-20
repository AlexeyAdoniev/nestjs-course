import { IsCurrency, IsOptional } from 'class-validator';
import { NameFilterDto } from '../../../../querying/dto/name-filter.dto';
import { IsCardinal } from '../../../../common/decorators/validators/is-cardinal.decorator';

export class ProductFilterDto extends NameFilterDto {
  @IsOptional()
  @IsCurrency()
  readonly price?: number;
  @IsOptional()
  @IsCardinal()
  readonly category?: number;
}
