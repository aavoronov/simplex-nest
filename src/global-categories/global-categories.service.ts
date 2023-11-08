import { Injectable } from '@nestjs/common';
import { CreateGlobalCategoryDto } from './dto/create-global-category.dto';
import { UpdateGlobalCategoryDto } from './dto/update-global-category.dto';
import { GlobalCategory } from './entities/global-category.entity';
import { App } from '../apps/entities/app.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Sequelize } from 'sequelize';
import { getWhereClause } from '../utils/functions';
import { User } from '../users/entities/user.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class GlobalCategoriesService {
  constructor(private readonly productsService: ProductsService) {}

  create(createGlobalCategoryDto: CreateGlobalCategoryDto) {
    return 'This action adds a new globalCategory';
  }

  async getGlobalCategories() {
    const globals = await GlobalCategory.findAll({
      attributes: ['id', 'name'],
    });
    return globals;
  }

  async getOneGlobalCategory(id: number) {
    const apps = await Category.findAll({
      where: { globalCategoryId: id },
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'productCount'],
        ],
      },
      include: [
        {
          model: Product,
          where: { status: 'active' },
          attributes: [],
        },
        { model: App, attributes: ['id', 'name', 'miniPic'] },
        { model: GlobalCategory, attributes: ['name'] },
      ],
      subQuery: false,
      limit: 15,
      group: ['Category.id', 'app.id', 'globalCategory.id'],
      order: [['productCount', 'DESC']],
    });

    const products = await this.productsService.findAll(
      {},
      {
        globalCategoryId: id,
      },
    );

    return { apps, products };
  }

  update(id: number, updateGlobalCategoryDto: UpdateGlobalCategoryDto) {
    return `This action updates a #${id} globalCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} globalCategory`;
  }
}
