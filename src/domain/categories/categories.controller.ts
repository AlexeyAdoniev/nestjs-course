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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IdDto } from '../../common/dto/id.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoriesService.findAll(pagination);
  }

  @Get()
  findOne(@Param('id') { id }: IdDto) {
    return this.categoriesService.findOne(id);
  }

  @Patch()
  update(
    @Param('id') { id }: IdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete()
  remove(@Param('id') { id }: IdDto) {
    return this.categoriesService.remove(id);
  }
}
