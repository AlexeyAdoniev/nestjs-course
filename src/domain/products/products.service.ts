import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../querying/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../querying/util/querying.constants';
import { StorageService } from '../../files/storage/storage.service';
import { join } from 'node:path';
import { PaginationService } from '../../querying/pagination.service';
import { ProductsQueryDto } from './dto/querying/products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly storageService: StorageService,
    private readonly paginationService: PaginationService,
  ) {}

  async deleteImage(id: number, filename: string) {
    const fullPath = join(id.toString(), filename);
    await this.storageService.validatePath(fullPath);
    return this.storageService.delete(fullPath);
  }
  async downloadImage(id: number, filename: string) {
    const fullPath = join(id.toString(), filename);
    await this.storageService.validatePath(fullPath);
    return this.storageService.getFile(fullPath);
  }
  async uploadImages(id: number, files: Express.Multer.File[]) {
    const file = files.at(0);
    await this.storageService.createDir(id.toString(), file);
    return this.storageService.saveFile(id.toString(), file);
  }
  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(queryDto: ProductsQueryDto) {
    const { page, name, price, category, sort, order } = queryDto;
    const limit = queryDto.limit ?? DEFAULT_PAGE_SIZE.PRODUCT;
    const offset = this.paginationService.calcOffset(limit, page);
    const [data, count] = await this.productRepository.findAndCount({
      where: {
        name: name ? ILike(`%${name}%`) : undefined,
        price,
        categories: { id: category },
      },
      relations: { categories: true },
      select: { categories: { name: true } },
      order: {
        [sort]: order,
      },
      skip: offset,
      take: limit,
      cache: 60_000,
    });

    const meta = this.paginationService.createMeta(limit, page, count);

    return { data, meta };
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
