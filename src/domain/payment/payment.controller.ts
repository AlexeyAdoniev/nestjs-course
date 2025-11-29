import { PaymentService } from './payment.service';
import { IdDto } from '../../common/dto/id.dto';
import { Post, Param, Controller } from '@nestjs/common';
import { User } from '../../auth/decorators/user.decorator';
import type { RequestUser } from '../../auth/interfaces/request-user.interface';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  payOrder(@Param() { id }: IdDto, @User() user: RequestUser) {
    return this.paymentService.payOrder(id, user);
  }
}
