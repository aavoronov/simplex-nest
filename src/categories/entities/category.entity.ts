import { App } from '@/src/apps/entities/app.entity';
import { Constraint } from '@/src/constraints/entities/constraint.entity';
import { GlobalCategory } from '@/src/global-categories/entities/global-category.entity';
import { Product } from '@/src/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  HasOne,
} from 'sequelize-typescript';

@Table
export class Category extends Model<Category> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string;

  @HasMany(() => Constraint)
  constraints: Constraint;

  @BelongsTo(() => App)
  app: App;

  @ForeignKey(() => App)
  appId: number;

  @HasMany(() => Product)
  products: Product;

  @BelongsTo(() => GlobalCategory)
  globalCategory: GlobalCategory;

  @ForeignKey(() => GlobalCategory)
  globalCategoryId: number;
}
