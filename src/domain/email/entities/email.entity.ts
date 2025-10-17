import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;

  @Column()
  provider: string;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
