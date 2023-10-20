import { Category } from '@/src/categories/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

const constraints = ['binary', 'numeric', 'oneOf'] as const;

type ConstraintType = (typeof constraints)[number];

@Table
export class Constraint extends Model<Constraint> {
  @Column({
    type: DataType.ENUM(...constraints),
    allowNull: false,
  })
  @ApiProperty()
  type: ConstraintType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty()
  value: string[];

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Category)
  categoryId: number;
}
