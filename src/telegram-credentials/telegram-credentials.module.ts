import { Module } from '@nestjs/common';
import { TelegramCredentialsService } from './telegram-credentials.service';
import { TelegramCredentialsController } from './telegram-credentials.controller';

@Module({
  controllers: [TelegramCredentialsController],
  providers: [TelegramCredentialsService]
})
export class TelegramCredentialsModule {}
