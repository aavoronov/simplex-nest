import { Module } from '@nestjs/common';
import { GlobalCategoriesService } from './global-categories.service';
import { GlobalCategoriesController } from './global-categories.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [GlobalCategoriesController],
  providers: [GlobalCategoriesService],
  imports: [ProductsModule],
})
export class GlobalCategoriesModule {}
