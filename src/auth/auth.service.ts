import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { Role } from './roles/enums/role.enum';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
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

    return this.createRequestUser(user);
  }

  login(user: RequestUser) {
    const payload: JWTPayload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async assignRole(id: number, role: Role) {
    const user = await this.userRepository.preload({ id, role });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(user);
  }
  getProfile(id: number) {
    return this.userRepository.findOneBy({ id });
  }
  async validateJwt(payload: JWTPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.createRequestUser(user);
  }

  private createRequestUser(user: User): RequestUser {
    return { id: user.id, role: user.role };
  }
}
