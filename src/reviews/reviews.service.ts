import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, Rating } from './entities/review.entity';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { App } from '../apps/entities/app.entity';
import { getWhereClause } from '../utils/functions';
import { User } from '../users/entities/user.entity';
import { Sequelize } from 'sequelize';

@Injectable()
export class ReviewsService {
  async createReview(createReviewDto: CreateReviewDto) {
    console.log(createReviewDto);

    const { userId, productId, rating, text } = createReviewDto;

    const ratings = [1, 2, 3, 4, 5];

    if (!ratings.includes(createReviewDto.rating)) {
      throw new HttpException('Некорректный рейтинг', StatusCodes.BAD_REQUEST);
    }

    await Review.create({
      userId,
      productId: +productId,
      rating: rating,
      text,
    });
    return { status: StatusCodes.OK, text: ReasonPhrases.OK };
  }

  async getAllReviews(queries: Record<string, string>) {
    const { _limit, _offset } = getWhereClause({ queries });
    const res = await Review.findAll({
      attributes: ['text', 'rating', 'createdAt'],
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'pics'],
        },
        { model: User, attributes: ['name', 'profilePic'] },
      ],
      limit: _limit,
      offset: _offset,
    });
    return res;
  }

  async getReviewStats() {
    const stats = await Review.findOne({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'average'],
        [Sequelize.fn('COUNT', Sequelize.col('rating')), 'count'],
      ],
      raw: true,
    });

    return stats;
  }

  async getReviewsToUsersProducts(
    userId: number,
    queries: Record<string, string>,
  ) {
    const { _limit, _offset } = getWhereClause({ queries });
    const res = await Review.findAll({
      attributes: ['text', 'rating', 'createdAt'],
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'pics'],
          where: { userId: userId },
        },
        { model: User, attributes: ['name', 'profilePic'] },
      ],
      limit: _limit,
      offset: _offset,
    });
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
