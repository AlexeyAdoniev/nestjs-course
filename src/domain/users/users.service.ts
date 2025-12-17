import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Email } from '../email/entities/email.entity';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';
import { PaginationDto } from '../../querying/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../querying/util/querying.constants';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { compareUserId } from '../../auth/util/authorization.util';
import { Role } from '../../auth/roles/enums/role.enum';
import { LoginDto } from '../../auth/dto/login.dto';
import { HashingService } from '../../auth/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = await this.emailRepository.findOneBy({
      id: createUserDto.email,
    });
    const user = this.userRepository.create({
      ...createUserDto,
      email,
    });
    return this.userRepository.save(user);
  }

  findAll({ limit }: PaginationDto) {
    return this.userRepository.find({
      // skip: offset,
      // take: limit ?? DEFAULT_PAGE_SIZE.USER,
      select: {
        email: {
          id: true,
          email: true,
        },
      },
      relations: {
        email: true,
      },
      cache: 60_000,
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      cache: 60_000,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: RequestUser,
  ) {
    currentUser.role !== Role.ADMIN && compareUserId(id, currentUser.id);

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload: Partial<User> = {
      ...updateUserDto,
      email: undefined,
    };

    if (isNumber(updateUserDto.email)) {
      const email = await this.emailRepository.findOneBy({
        id: updateUserDto.email,
      });
      if (!email) {
        throw new NotFoundException('Email not found');
      }
      payload.email = email;
    }
    const merged = this.userRepository.merge(user, payload);
    return this.userRepository.save(merged);
  }

  remove(id: number, soft: boolean, currentUser: RequestUser) {
    if (currentUser.role !== Role.ADMIN) {
      compareUserId(id, currentUser.id);

      if (!soft) throw new ForbiddenException();
    }

    return soft
      ? this.userRepository.softRemove({ id })
      : this.userRepository.delete({ id });
  }

  async recover(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email: { email } },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException();
    }

    const encrypted = await this.hashingService.hash(password, user.salt);

    const isMatch = this.hashingService.compare(
      encrypted.hashedPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.registryDates.deletedAt) {
      throw new ConflictException();
    }

    return this.userRepository.recover([user]);
  }
}
