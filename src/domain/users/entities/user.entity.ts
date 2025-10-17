import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { Email } from '../../email/entities/email.entity';

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

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
