import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Email } from '../email/entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Email])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
