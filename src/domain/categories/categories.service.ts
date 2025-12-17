import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../querying/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../querying/util/querying.constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll({ limit }: PaginationDto) {
    return this.categoryRepository.find({
      // skip: offset,
      // take: limit ?? DEFAULT_PAGE_SIZE.CATEGORY,
      cache: 60_000,
    });
  }

  async findOne(id: number) {
    return this.categoryRepository.findOneOrFail({
      where: { id },
      relations: {
        products: true,
      },
      cache: 60_000,
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.products.length) {
      throw new ConflictException('Category has related products');
    }
    return this.categoryRepository.delete({ id });
  }
}
