import { Controller } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';

@Controller('tg-bot')
export class TgBotController {
  constructor(private readonly tgBotService: TgBotService) {}
}
