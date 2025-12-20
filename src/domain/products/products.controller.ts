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

import { PaginationDto } from '../../querying/dto/pagination.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';

import { Role } from '../../auth/roles/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from '../../files/util/file-validation.util';
import {
  MaxFileCount,
  MULTIPART_FORMDATA_KEY,
} from '../../files/util/file.constants';
import { IdFilenameDto } from '../../files/dto/id-filename.dto';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FilesSchema } from '../../files/validators/swagger/decorator/schemas/files.schema';
import { FileSchema } from '../../files/validators/swagger/decorator/schemas/file.schema';
import { BodyInterceptor } from '../../files/interceptors/body.interceptor/body.interceptor.interceptor';
import { ApiPaginatedResponse } from '../../querying/swagger/decorators/api-paginated-response.decorator';
import { Product } from './entities/product.entity';
import { ProductsQueryDto } from './dto/querying/products-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiPaginatedResponse(Product)
  @Public()
  @Get()
  findAll(@Query() PaginationDto: ProductsQueryDto) {
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

  @ApiConsumes(MULTIPART_FORMDATA_KEY)
  @ApiBody({ type: FilesSchema })
  @Public()
  // @Roles(Role.MANAGER)
  @UseInterceptors(
    FilesInterceptor('files', MaxFileCount.PRODUCT_IMAGES),
    //BodyInterceptor,
  )
  @Post(':id/images')
  uploadImage(
    @Param() { id }: IdDto,
    //@Body() createProductDto: CreateProductDto,
    @UploadedFiles(createParseFilePipe('2MB', ['png', 'jpeg', 'pdf']))
    files: Express.Multer.File[],
  ) {
    return this.productsService.uploadImages(id, files);
  }

  @ApiOkResponse({ type: FileSchema })
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
