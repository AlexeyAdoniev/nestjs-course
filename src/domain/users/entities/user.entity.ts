import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { Email } from '../../email/entities/email.entity';
import { Order } from '../../orders/entities/order.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../../auth/roles/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column({ name: 'emailId', unique: true, nullable: true })
  emailId: number;

  @OneToOne(() => Email)
  @JoinColumn({ name: 'emailId' })
  email: Email;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'role_enum',
    default: Role.USER,
  })
  role: Role;

  @Column({ nullable: true, type: 'varchar' })
  salt: string;
  @Column({ unique: true, type: 'varchar' })
  phone: string;

  @OneToMany(() => Order, (order) => order.customer, {
    cascade: ['soft-remove', 'recover'],
  })
  orders: Order[];

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
