import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChatRoom } from '../../chat-rooms/entities/chat-room.entity';
import { User } from '../../users/entities/user.entity';

@Table
export class Message extends Model<Message> {
  @Column({
    type: DataType.STRING(1500),
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  files: string[];

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => ChatRoom)
  roomId: number;

  @BelongsTo(() => ChatRoom)
  room: ChatRoom;
}
