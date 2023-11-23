import { Category } from '@/src/categories/entities/category.entity';
import { Constraint } from '@/src/constraints/entities/constraint.entity';
import { Purchase } from '@/src/purchases/entities/purchase.entity';
import { Review } from '@/src/reviews/entities/review.entity';
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

const productStatuses = ['active', 'hidden', 'sold'] as const;
export type ProductStatusType = (typeof productStatuses)[number];

@Table
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string;

  @Column({
    type: DataType.STRING(10000),
    allowNull: false,
  })
  @ApiProperty()
  description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  @ApiProperty()
  price: number;

  @Column({
    type: DataType.ENUM(...productStatuses),
    defaultValue: 'active',
    allowNull: false,
  })
  @ApiProperty()
  status: ProductStatusType;

  @Column({
    type: DataType.JSONB,
  })
  @ApiProperty()
  properties: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  @ApiProperty()
  pics: string[];

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Category)
  categoryId: number;

  @HasMany(() => Purchase)
  purchases: Purchase;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @HasMany(() => Review)
  reviews: Review;
}
