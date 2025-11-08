import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { Email } from '../../email/entities/email.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToOne(() => Email)
  @JoinColumn()
  email: Email;
  @Column()
  password: string;
  @Column({ unique: true, type: 'varchar' })
  phone: string;

  @OneToMany(() => Order, (order) => order.customer, {
    cascade: ['soft-remove', 'recover'],
  })
  orders: Order[];

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
