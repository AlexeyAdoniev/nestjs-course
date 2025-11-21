import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async validateLocal(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: { email } },
      select: { id: true, password: true, salt: true },
      relations: ['email'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const encrypted = await this.hashingService.hash(password, user.salt);

    const isMatch = this.hashingService.compare(
      encrypted.hashedPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return { id: user.id };
  }
}
