import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatusType } from './entities/product.entity';
import { Op, Sequelize } from 'sequelize';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getWhereClause } from '../utils/functions';
import { Category } from '../categories/entities/category.entity';
import { App } from '../apps/entities/app.entity';
import { Review } from '../reviews/entities/review.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(private readonly usersService: UsersService) {}

  async create(body: any) {
    console.log(body);
    const { name, description, price, properties, categoryId } = body;
    const product = await Product.create({
      name,
      description,
      price,
      properties: properties,
      categoryId,
    });
    return product;
  }

  async getUsersProducts(id: number) {
    const products = await Product.findAll({
      where: { userId: id, status: 'active' },
      attributes: ['id', 'name', 'description', 'price', 'pics'],
    });
    return products;
  }

  async getMyProducts(id: number, queries: Record<string, string>) {
    const { _limit, _offset } = getWhereClause({ queries });
    const products = await Product.findAll({
      where: { userId: id },
      attributes: ['id', 'name', 'description', 'price', 'status', 'pics'],
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
          include: [{ model: App, attributes: ['id', 'name', 'miniPic'] }],
        },
      ],
      limit: _limit,
      offset: _offset,
    });
    return products;
  }

  async findAll(queries: Record<string, any>, innerWhereClause?: any) {
    const { _offset, _limit, whereClause } = getWhereClause({
      queries,
      initial: { status: 'active' },
      limit: 15,
    });

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

    const products = await Product.findAll({
      where: whereClause,
      limit: _limit,
      offset: _offset,
      include: [
        {
          model: Category,
          where: innerWhereClause,
          attributes: ['id', 'name'],
          include: [{ model: App, attributes: ['id', 'name', 'miniPic'] }],
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
        'pics',
        [avgLiteral, 'average'],
        [countLiteral, 'count'],
      ],
    });

    return products;
  }

  async getOneAppsProducts(queries: Record<string, any>, appId: number) {
    const { _offset, _limit, whereClause } = getWhereClause({
      queries,
      initial: { status: 'active' },
      limit: 15,
    });

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

    const products = await Product.findAll({
      where: whereClause,
      limit: _limit,
      offset: _offset,
      include: [
        {
          model: Category,
          where: { appId: appId },
          attributes: ['id', 'name'],
          include: [{ model: App, attributes: ['id', 'name', 'miniPic'] }],
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
        'pics',
        [avgLiteral, 'average'],
        [countLiteral, 'count'],
      ],
    });

    return products;
  }

  async countAll(queries: Record<string, any>, appId: number) {
    const { whereClause } = getWhereClause({
      queries,
      initial: { status: 'active' },
    });

    const { rows, count } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          where: { appId: appId },
          attributes: ['id', 'name'],
          include: [{ model: App, attributes: ['id', 'name'] }],
        },
      ],
      attributes: ['id'],
    });

    return { count };
  }

  async findOne(id: number) {
    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: [
        'id',
        'name',
        'description',
        'pics',
        'price',
        'status',
        'properties',
        'createdAt',
      ],
      include: [
        {
          model: User,
          attributes: [
            'id',
            // [
            //   Sequelize.fn('AVG', Sequelize.col('products.reviews.rating')),
            //   'average',
            // ],
            // [
            //   Sequelize.fn('COUNT', Sequelize.col('products.reviews.rating')),
            //   'count',
            // ],
          ],
          include: [
            {
              model: Product,
              where: { status: ['active', 'sold'] },
              attributes: ['id', 'name', 'pics'],
              limit: 3,
              order: [[{ model: Review, as: 'reviews' }, 'id', 'DESC']],
              include: [
                {
                  required: true,
                  model: Review,
                  attributes: ['id', 'text', 'rating', 'createdAt'],
                  include: [
                    {
                      model: User,
                      attributes: ['id', 'name', 'login', 'profilePic'],
                    },
                  ],
                },
                // {
                //   model: Review,
                //   as: 'reviews',
                //   attributes: ['id'],
                //   duplicating: false,
                // },
              ],
            },
          ],
        },
      ],
      // group: ['Product.id', 'user.id', 'user.products.id'],
    });

    const user = await this.usersService.getAProfile(product.user.id);

    return { product, user };
  }

  async changeProductStatus(
    id: number,
    body: {
      userId: number;
      status: ProductStatusType;
    },
  ) {
    const [count] = await Product.update(
      { status: body.status },
      {
        where: { id: id, userId: body.userId },
      },
    );

    if (!count) {
      throw new HttpException(
        'Ресурс не был обновлен',
        StatusCodes.UNAUTHORIZED,
        {
          cause: new Error('Some Error'),
        },
      );
    }

    return { status: StatusCodes.OK, text: ReasonPhrases.OK };
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
