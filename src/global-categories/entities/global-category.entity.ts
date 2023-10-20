import { Category } from '@/src/categories/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table
export class GlobalCategory extends Model<GlobalCategory> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string;

  @HasMany(() => Category)
  categories: Category;
}
