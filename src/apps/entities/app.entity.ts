import { Category } from '@/src/categories/entities/category.entity';
import { Constraint } from '@/src/constraints/entities/constraint.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table
export class App extends Model<App> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isGame: boolean;

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  miniPic: string;

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  pagePic: string;

  @HasMany(() => Category)
  categories: Category;
}
