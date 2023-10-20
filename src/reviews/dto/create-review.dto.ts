import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '../entities/review.entity';

export class CreateReviewDto {
  @ApiProperty({ required: true })
  readonly productId: string;

  @ApiProperty({ required: true })
  readonly userId: number;

  @ApiProperty({ required: true })
  readonly rating: Rating;

  @ApiProperty({ required: false })
  readonly text: string;
}
