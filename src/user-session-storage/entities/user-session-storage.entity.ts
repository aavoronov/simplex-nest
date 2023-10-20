import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class UserSessionStorage extends Model<UserSessionStorage> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  storyStep: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  replies: string;
}
