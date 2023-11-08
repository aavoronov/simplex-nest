import { Module } from '@nestjs/common';
import { ChatRoomsModule } from '../chat-rooms/chat-rooms.module';
import { ChatRoomsService } from '../chat-rooms/chat-rooms.service';
import { ChatModule } from '../chat/chat.module';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, ChatRoomsService],
  imports: [ChatModule, ChatRoomsModule],
})
export class TasksModule {}
