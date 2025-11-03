import { IsEntity } from '../../../common/decorators/validators/is-entity.decorator';
import { IdDto } from '../../../common/dto/id.dto';
import { OrderItemDto } from './order-item.dto';
import { ArrayNotEmpty, ArrayUnique, ValidateNested } from 'class-validator';
import { IdentifierFn } from '../../../common/util/id.util';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsEntity()
  readonly customer: IdDto;

  @ArrayNotEmpty()
  @ArrayUnique(IdentifierFn.ORDER_ITEM_DTO)
  @ValidateNested()
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];
}
