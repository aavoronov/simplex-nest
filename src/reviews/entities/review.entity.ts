import { Category } from '@/src/categories/entities/category.entity';
import { Constraint } from '@/src/constraints/entities/constraint.entity';
import { Product } from '@/src/products/entities/product.entity';
import { Purchase } from '@/src/purchases/entities/purchase.entity';
import { User } from '@/src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

const ratings = [1, 2, 3, 4, 5] as const;
export type Rating = (typeof ratings)[number];

@Table
export class Review extends Model<Review> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  text: string;

  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
  })
  @ApiProperty()
  rating: Rating;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => Product)
  products: Product;

  @ForeignKey(() => Product)
  productId: number;
}
