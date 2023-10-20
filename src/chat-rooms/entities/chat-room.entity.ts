import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../../chat/entities/message.entity';
import { RoomAccess } from '../../room-accesses/entities/room-access.entity';

@Table
export class ChatRoom extends Model<ChatRoom> {
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => RoomAccess)
  roomId: number;

  @HasMany(() => Message)
  messages: Message;

  @HasMany(() => RoomAccess)
  accesses: RoomAccess;
}
