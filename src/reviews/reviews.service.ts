import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, Rating } from './entities/review.entity';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { App } from '../apps/entities/app.entity';
import { getWhereClause } from '../utils/functions';

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

  async getReviewsToMyProducts(
    userId: number,
    queries: Record<string, string>,
  ) {
    const { _limit, _offset } = getWhereClause({ queries });
    const res = await Review.findAll({
      include: [
        {
          model: Product,
          where: { userId: userId },
          include: [{ model: Category, include: [{ model: App }] }],
        },
      ],
      limit: _limit,
      offset: _offset,
    });
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
