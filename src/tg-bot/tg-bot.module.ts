import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { TgBotController } from './tg-bot.controller';
import { StoryScene } from './quiz.scenes';
import { UserSessionStorageModule } from '../user-session-storage/user-session-storage.module';

@Module({
  controllers: [TgBotController],
  providers: [TgBotService, StoryScene],
  imports: [UserSessionStorageModule],
})
export class TgBotModule {}
