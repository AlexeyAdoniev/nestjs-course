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
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { Role } from '../../auth/roles/enums/role.enum';
import { compareUserId } from '../../auth/util/authorization.util';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async payOrder(id: number, currentUser: RequestUser) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        payment: true,
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException();
    }

    currentUser.role !== Role.ADMIN &&
      compareUserId(order.customer.id, currentUser.id);

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
