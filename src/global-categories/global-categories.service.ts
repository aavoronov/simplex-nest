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
        { model: App, attributes: ['id', 'name'] },
      ],
      subQuery: false,
      limit: 15,
      group: ['Category.id', 'app.id'],
      order: [['productCount', 'DESC']],
    });

    // const products = await Product.findAll({
    //   attributes: ['id', 'name', 'description', 'price'],
    //   where: { status: 'active' },
    //   include: [
    //     {
    //       model: Category,
    //       where: { globalCategoryId: id },
    //       attributes: [],
    //     },
    //   ],
    //   limit: 15,
    //   order: [['id', 'DESC']],
    // });

    const products = await this.productsService.findAll(
      {},
      {
        globalCategoryId: id,
      },
    );

    const avgLiteral =
      Sequelize.literal(`(SELECT AVG("products->reviews"."rating") AS "average"
    FROM "Users" AS "User" 
    INNER JOIN "Products" AS "products" ON "User"."id" = "products"."userId" AND "products"."status" IN ('active', 'sold') 
    INNER JOIN "Reviews" AS "products->reviews" ON "products"."id" = "products->reviews"."productId" 
    WHERE "User"."id" = "Product"."userId"
    GROUP BY "User"."id")`);

    const countLiteral =
      Sequelize.literal(`(SELECT COUNT("products->reviews"."rating") AS "count"
    FROM "Users" AS "User" 
    INNER JOIN "Products" AS "products" ON "User"."id" = "products"."userId" AND "products"."status" IN ('active', 'sold') 
    INNER JOIN "Reviews" AS "products->reviews" ON "products"."id" = "products->reviews"."productId" 
    WHERE "User"."id" = "Product"."userId"
    GROUP BY "User"."id")`);

    const { _offset, _limit, whereClause } = getWhereClause({
      queries: {},
      initial: { status: 'active' },
      limit: 15,
    });
    const products1 = await Product.findAll({
      where: whereClause,
      limit: _limit,
      offset: _offset,
      include: [
        {
          model: Category,
          attributes: ['name'],
          include: [{ model: App, attributes: ['id', 'name'] }],
        },
        {
          model: User,
          as: 'user',
          attributes: [],
        },
      ],
      attributes: [
        'id',
        'name',
        'price',
        [avgLiteral, 'average'],
        [countLiteral, 'count'],
      ],
    });

    return { apps, products };
  }

  update(id: number, updateGlobalCategoryDto: UpdateGlobalCategoryDto) {
    return `This action updates a #${id} globalCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} globalCategory`;
  }
}
