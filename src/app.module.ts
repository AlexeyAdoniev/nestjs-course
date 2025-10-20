import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './domain/email/email.module';
import { EnvModule } from './env/env.module';
import { OrdersModule } from './domain/orders/orders.module';
import { PaymentModule } from './domain/payment/payment.module';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    DatabaseModule,
    EmailModule,
    EnvModule,
    OrdersModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
