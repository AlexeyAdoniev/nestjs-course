import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Email } from '../email/entities/email.entity';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
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

  findAll({ offset, limit }: PaginationDto) {
    return this.userRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload: Partial<User> = { ...updateUserDto, email: undefined };

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

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
