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
  UploadedFiles,
  Header,
  Headers,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatusType } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Headers('Authorization') token: string,
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productsService.create(body, token, files);
  }

  @Get('of/:id')
  getUsersProducts(@Param('id') id: string) {
    return this.productsService.getUsersProducts(+id);
  }

  @Get('my')
  getMyProducts(
    @Body() body: { userId: number },
    @Query() queries: Record<string, string>,
  ) {
    return this.productsService.getMyProducts(+body.userId, queries);
  }

  @Get()
  findAll(@Query() queries: Record<string, string>) {
    return this.productsService.findAll(queries);
  }

  @Get('app/:id')
  getOneAppsProducts(
    @Query() queries: Record<string, string>,
    @Param('id') id: string,
  ) {
    return this.productsService.getOneAppsProducts(queries, +id);
  }

  @Get('count/:id')
  countAll(@Query() queries: Record<string, string>, @Param('id') id: string) {
    return this.productsService.countAll(queries, +id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  changeProductStatus(
    @Param('id') id: string,
    @Body()
    body: {
      userId: number;
      status: ProductStatusType;
    },
  ) {
    return this.productsService.changeProductStatus(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
