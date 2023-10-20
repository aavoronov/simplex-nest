import { Product } from '@/src/products/entities/product.entity';
import { Purchase } from '@/src/purchases/entities/purchase.entity';
import { Review } from '@/src/reviews/entities/review.entity';
import { TelegramCredential } from '@/src/telegram-credentials/entities/telegram-credential.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';

const roles = ['user', 'admin'] as const;

type RoleType = (typeof roles)[number];

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  @ApiProperty()
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.ENUM(...roles),
    allowNull: true,
    defaultValue: 'user',
  })
  @ApiProperty()
  role: RoleType;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  @ApiProperty()
  isBlocked: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  @ApiProperty()
  isDeleted: boolean;

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  profilePic: string;

  @HasMany(() => Purchase)
  purchases: Purchase;

  @HasMany(() => Product)
  products: Product;

  @HasMany(() => Review)
  reviews: Review;

  @HasOne(() => TelegramCredential)
  TelegramCredential: TelegramCredential;
}
