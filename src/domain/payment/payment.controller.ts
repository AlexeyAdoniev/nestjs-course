import { PaymentService } from './payment.service';
import { IdDto } from '../../common/dto/id.dto';
import { Post, Param, Controller } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  payOrder(@Param() { id }: IdDto) {
    return this.paymentService.payOrder(id);
  }
}
