import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IdDto } from '../../common/dto/id.dto';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';

import { Role } from '../../auth/roles/enums/role.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  createFileValidators,
  createParseFilePipe,
} from '../../files/util/file-validation.util';
import { MaxFileCount } from '../../files/util/file.constants';
import { IdFilenameDto } from '../../files/dto/id-filename.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query() PaginationDto: PaginationDto) {
    return this.productsService.findAll(PaginationDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdDto, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.productsService.remove(id);
  }

  @Public()
  // @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCT_IMAGES))
  @Post(':id/images')
  uploadImage(
    @Param() { id }: IdDto,
    @UploadedFiles(createParseFilePipe('2MB', ['png', 'jpeg', 'pdf']))
    files: Express.Multer.File[],
  ) {
    return this.productsService.uploadImages(id, files);
  }

  @Public()
  @Get(':id/images/:filename')
  downloadImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.downloadImage(id, filename);
  }

  @Public()
  //@Roles(Role.MANAGER)
  @Delete(':id/images/:filename')
  deleteImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.deleteImage(id, filename);
  }
}
