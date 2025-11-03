import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../orders/enums/order.status.enum';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async payOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException();
    }

    if (order.payment) {
      throw new ConflictException();
    }

    const payment = this.paymentRepository.create();

    order.payment = payment;
    order.status = OrderStatus.AWAITING_SHIPMENT;

    //saving the order and payment in a single operation
    return this.orderRepository.save(order);
  }
}
