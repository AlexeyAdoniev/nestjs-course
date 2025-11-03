import { ArrayUniqueIdentifier } from 'class-validator';
import { IdDto } from '../dto/id.dto';
import { OrderItemDto } from '../../domain/orders/dto/order-item.dto';

export const IdentifierFn = {
  ID_DTO: (dto: IdDto) => dto.id,
  ORDER_ITEM_DTO: (dto: OrderItemDto) => dto.product?.id,
} as const satisfies Record<string, ArrayUniqueIdentifier>;
