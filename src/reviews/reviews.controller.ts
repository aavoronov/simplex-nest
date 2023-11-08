import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get('')
  getAllReviews(@Query() queries: Record<string, string>) {
    return this.reviewsService.getAllReviews(queries);
  }

  @Get('stats')
  getReviewStats() {
    return this.reviewsService.getReviewStats();
  }

  @Get(':id')
  getReviewsToUsersProducts(
    @Param('id') id: number,
    @Query() queries: Record<string, string>,
  ) {
    return this.reviewsService.getReviewsToUsersProducts(id, queries);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
