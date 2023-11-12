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
import { nanoid } from 'nanoid/non-secure';
import { writeFile } from 'fs';

@Injectable()
export class ProductsService {
  constructor(private readonly usersService: UsersService) {}

  private async uploadFiles(
    files: Array<Express.Multer.File>,
  ): Promise<string[]> {
    try {
      const filenames = [];

      files.forEach((item: Express.Multer.File) => {
        let dbFileName = null;
        // console.log(item.mimetype);

        const fileName = nanoid();
        dbFileName =
          fileName +
          item.originalname.slice(item.originalname.lastIndexOf('.'));

        filenames.push(dbFileName);

        if (item.mimetype === 'application/octet-stream') {
          const b64string = item.buffer.toString();
          // var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
          const base64Image = b64string.split(';base64,').pop();
          const buf = Buffer.from(b64string);
          // const buf = Buffer.from(item.buffer, 'base64');
          // console.log(buf);
          // // console.log(item.buffer.toString());
          writeFile(
            `./uploads/products/${dbFileName}`,
            base64Image,
            { encoding: 'base64' },
            (err) => {
              !!err && console.log(err);
            },
          );
        } else {
          const buffer = item.buffer;
          // const myBuffer = Buffer.from(item);
          writeFile(`./uploads/products/${dbFileName}`, buffer, (err) => {
            !!err && console.log(err);
          });
        }
      });
      return filenames;
    } catch (e) {
      // console.log(e);
    }
  }

  async create(body: any, token: string, files: Array<Express.Multer.File>) {
    console.log(body);
    const { name, description, price, properties, categoryId } = body;

    const user = await this.usersService.getUserByToken(token);

    const dbFilenames = await this.uploadFiles(files);
    const images = dbFilenames.length ? dbFilenames : null;

    const re = new RegExp(/^[0-9\b]+$/);
    if (!re.test(price)) {
      throw new HttpException(
        'Указанная цена имеет неверный формат',
        StatusCodes.BAD_REQUEST,
        {
          cause: new Error('Some Error'),
        },
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      properties: JSON.parse(properties),
      categoryId,
      userId: user.id,
      pics: images,
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
    // const { extracted, queries: rest } = extractInnerWhereClause({
    //   queries,
    //   fields: ['globalCategoryId'],
    // });
    // console.log({ extracted, rest });
    const { _offset, _limit, whereClause, extracted } = getWhereClause({
      queries,
      initial: { status: 'active' },
      limit: 15,
      extract: ['globalCategoryId', 'discount', 'withReviews'],
    });

    console.log({ _offset, _limit, whereClause, extracted });

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
          attributes: ['id', 'name', 'globalCategoryId'],
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
    // const { _offset, _limit, whereClause } = getWhereClause({
    //   queries,
    //   initial: { status: 'active' },
    //   limit: 15,
    // });

    const { _offset, _limit, whereClause, extracted } = getWhereClause({
      queries,
      initial: { status: 'active' },
      limit: 15,
      extract: ['globalCategoryId', 'discount', 'withReviews'],
    });
    console.log({ _offset, _limit, whereClause, extracted });

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
          where: extracted.withReviews ? { hasReviews: true } : undefined,
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
    // const { whereClause } = getWhereClause({
    //   queries,
    //   initial: { status: 'active' },
    // });

    const countLiteral =
      Sequelize.literal(`(SELECT COUNT("products->reviews"."rating") AS "count"
    FROM "Users" AS "User" 
    INNER JOIN "Products" AS "products" ON "User"."id" = "products"."userId" AND "products"."status" IN ('active', 'sold') 
    INNER JOIN "Reviews" AS "products->reviews" ON "products"."id" = "products->reviews"."productId" 
    WHERE "User"."id" = "Product"."userId"
    GROUP BY "User"."id")`);

    const { whereClause, extracted } = getWhereClause({
      queries,
      initial: { status: 'active' },
      extract: ['globalCategoryId', 'discount', 'withReviews'],
    });

    console.log({ whereClause, extracted });

    const { count } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          where: { appId: appId },
          attributes: [],

          // include: [{ model: App, attributes: ['id', 'name'] }],
        },
        {
          model: User,
          attributes: ['hasReviews'],
          where: extracted.withReviews ? { hasReviews: true } : undefined,
        },
      ],
      attributes: ['id'],

      // , [countLiteral, 'count']
      // having: Sequelize.where(Sequelize.col('count'), Op.gt, 0),
      // having: Sequelize.where(countLiteral, {
      //   [Op.gt]: 0,
      // }),
      // group: ['Product.id', 'user.products.reviews.id', 'user.products.id'],
    });

    // const apps = await Category.findAll({
    //   where: { globalCategoryId: id },
    //   attributes: {
    //     include: [
    //       [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'productCount'],
    //     ],
    //   },
    //   include: [
    //     {
    //       model: Product,
    //       where: { status: 'active' },
    //       attributes: [],
    //     },
    //     { model: App, attributes: ['id', 'name', 'miniPic'] },
    //     { model: GlobalCategory, attributes: ['name'] },
    //   ],
    //   subQuery: false,
    //   limit: 15,
    //   group: ['Category.id', 'app.id', 'globalCategory.id'],
    //   order: [['productCount', 'DESC']],
    // });

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
