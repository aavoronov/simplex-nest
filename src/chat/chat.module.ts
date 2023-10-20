import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ChatRoomsModule } from '../chat-rooms/chat-rooms.module';
import { ChatRoomsService } from '../chat-rooms/chat-rooms.service';
import { AuthMiddleware } from '../utils/middleware/auth.middleware';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ChatRoomsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/chat/', method: RequestMethod.ALL });
  }
}
