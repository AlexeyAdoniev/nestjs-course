import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll({ offset, limit }: PaginationDto) {
    return this.productRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.PRODUCT,
      cache: 60_000,
    });
  }

  async findOne(id: number) {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        categories: true,
      },
      cache: 60_000,
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (product.orders.length) {
      throw new ConflictException('Product has related orders');
    }
    return this.productRepository.delete({ id });
  }
}
