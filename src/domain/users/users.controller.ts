import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { IdDto } from '../../common/dto/id.dto';

import { ConfigService } from '@nestjs/config';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RemoveDto } from '../orders/dto/remove.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() idDto: IdDto) {
    return this.usersService.findOne(idDto.id);
  }

  @Patch(':id')
  update(@Param() idDto: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(idDto.id, updateUserDto);
  }

  @Patch(':id/recover')
  recover(@Param() idDto: IdDto) {
    return this.usersService.recover(idDto.id);
  }

  @Delete(':id')
  remove(@Param() idDto: IdDto, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(idDto.id, soft);
  }
}
