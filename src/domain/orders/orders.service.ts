import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

import { InjectRepository } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';
import { OrderItemDto } from './dto/order-item.dto';
import { Product } from '../products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    const itemsWithPrice = await Promise.all(
      items.map((item) => this.createOrderItemWithPrice(item)),
    );

    const order = this.orderRepository.create({
      ...createOrderDto,
      items: itemsWithPrice,
    });
    return this.orderRepository.save(order);
  }

  findAll({ offset, limit }: PaginationDto) {
    return this.orderRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.ORDER,
      cache: 60_000,
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        items: {
          product: true,
        },
        customer: true,
        payment: true,
      },
      cache: 60_000,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    return this.orderRepository.delete({ id });
  }

  private async createOrderItemWithPrice(
    orderItemDto: OrderItemDto,
  ): Promise<OrderItem> {
    const { id } = orderItemDto.product;
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const orderItem = this.orderItemRepository.create({
      ...orderItemDto,
      price: product.price,
    });

    return orderItem;
  }
}
