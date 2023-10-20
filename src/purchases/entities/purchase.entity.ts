import { Product } from '@/src/products/entities/product.entity';
import { User } from '@/src/users/entities/user.entity';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

export const statuses = [
  'created',
  'disputed',
  'completed',
  'cancelled',
] as const;

export type StatusType = (typeof statuses)[number];

@Table
export class Purchase extends Model<Purchase> {
  @Column({
    type: DataType.ENUM(...statuses),
    defaultValue: 'created',
  })
  status: StatusType;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  sum: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Product)
  productId: number;
}
