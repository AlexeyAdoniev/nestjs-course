import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../../domain/users/entities/user.entity';
import { Category } from '../../domain/categories/entities/category.entity';
import { Product } from '../../domain/products/entities/product.entity';
import { Order } from '../../domain/orders/entities/order.entity';
import { OrderItem } from '../../domain/orders/entities/order-item.entity';
import { Payment } from '../../domain/payment/entities/payment.entity';
import { Email } from '../../domain/email/entities/email.entity';
import { OrderStatus } from '../../domain/orders/enums/order.status.enum';

@Injectable()
export class SeedingService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usersRepository = this.dataSource.getRepository(User);
      const categoriesRepository = this.dataSource.getRepository(Category);
      const productsRepository = this.dataSource.getRepository(Product);
      const ordersRepository = this.dataSource.getRepository(Order);
      const orderItemsRepository = this.dataSource.getRepository(OrderItem);
      const paymentsRepository = this.dataSource.getRepository(Payment);
      const emailsRepository = this.dataSource.getRepository(Email);

      const orders = await ordersRepository.find();
      await ordersRepository.remove(orders);
      const users = await usersRepository.find();
      await usersRepository.remove(users);
      const products = await productsRepository.find();
      await productsRepository.remove(products);
      const categories = await categoriesRepository.find();
      await categoriesRepository.remove(categories);
      const emails = await emailsRepository.find();
      await emailsRepository.remove(emails);

      const cat1 = categoriesRepository.create({ name: 'Electronics' });
      const cat2 = categoriesRepository.create({ name: 'Books' });
      const cat3 = categoriesRepository.create({ name: 'Computers' });
      const cat4 = categoriesRepository.create({ name: 'Games' });

      await categoriesRepository.save([cat1, cat2, cat3, cat4]);

      const p1 = productsRepository.create({
        name: 'Book of Cain',
        description:
          'The writings of an elderly scholar about this perilous world.',
        price: 102.5,
        categories: [cat2],
      });
      const p2 = productsRepository.create({
        name: 'Smart TV',
        price: 2350,
        categories: [cat1, cat3],
      });
      const p3 = productsRepository.create({
        name: 'Macbook Pro',
        price: 1200,
        categories: [cat3],
      });
      const p4 = productsRepository.create({
        name: 'Gaming PC',
        description: 'Latest generation hardware for the best experience.',
        price: 2000,
        categories: [cat3],
      });
      const p5 = productsRepository.create({
        name: 'Game Mechanics: Advanced Game Design',
        description: 'Learn how to craft well-designed game mechanics.',
        price: 149.9,
        categories: [cat2],
      });
      const p6 = productsRepository.create({
        name: 'Warcraft III: Reign of Chaos',
        description: 'A true classic in the RTS genre.',
        price: 25.99,
        categories: [cat4],
      });

      await productsRepository.save([p1, p2, p3, p4, p5, p6]);

      const [email1, email2] = await Promise.all([
        emailsRepository.create({
          email: 'jarulf@mail.com',
          provider: 'Jafar',
        }),
        emailsRepository.create({
          email: 'chris@blizz.com',
          provider: 'Obunga',
        }),
        //emailsRepository.create({"email": "jarulf@mail.com"})
      ]);

      const u1 = usersRepository.create({
        name: 'Pedro Faria',
        email: await emailsRepository.save(email1),
        phone: '988888888',
        password: '123456',
      });
      const u2 = usersRepository.create({
        name: 'Chris Metzen',
        email: await emailsRepository.save(email2),
        phone: '977777777',
        password: '654321',
      });

      await usersRepository.save([u1, u2]);

      const oi1 = orderItemsRepository.create({
        product: p1,
        quantity: 2,
        price: p1.price,
      });
      const oi2 = orderItemsRepository.create({
        product: p3,
        quantity: 1,
        price: p3.price,
      });
      const oi3 = orderItemsRepository.create({
        product: p3,
        quantity: 2,
        price: p3.price,
      });
      const oi4 = orderItemsRepository.create({
        product: p5,
        quantity: 2,
        price: p5.price,
      });

      const pay1 = paymentsRepository.create();

      const o1 = ordersRepository.create({
        customer: u1,
        items: [oi1, oi2],
        status: OrderStatus.AWAITING_SHIPMENT,
        payment: pay1,
      });
      const o2 = ordersRepository.create({
        customer: u2,
        items: [oi3],
        status: OrderStatus.AWAITING_PAYMENT,
      });
      const o3 = ordersRepository.create({
        customer: u1,
        items: [oi4],
        status: OrderStatus.AWAITING_PAYMENT,
      });

      await ordersRepository.save([o1, o2, o3]);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
