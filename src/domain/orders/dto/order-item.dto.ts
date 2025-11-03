import { IsEntity } from '../../../common/decorators/validators/is-entity.decorator';
import { IdDto } from '../../../common/dto/id.dto';
import { IsCardinal } from '../../../common/decorators/validators/is-cardinal.decorator';

export class OrderItemDto {
  //   @IsEntity()
  //   readonly order: IdDto;
  @IsEntity()
  readonly product: IdDto;

  @IsCardinal()
  readonly quantity: number;
}
