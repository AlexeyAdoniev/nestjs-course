import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { OrderStatus } from '../enums/order.status.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.AWAITING_PAYMENT,
  })
  statis: OrderStatus;
  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  customer: User;
}
