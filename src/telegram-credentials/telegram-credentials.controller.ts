import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TelegramCredentialsService } from './telegram-credentials.service';
import { CreateTelegramCredentialDto } from './dto/create-telegram-credential.dto';
import { UpdateTelegramCredentialDto } from './dto/update-telegram-credential.dto';

@Controller('telegram-credentials')
export class TelegramCredentialsController {
  constructor(
    private readonly telegramCredentialsService: TelegramCredentialsService,
  ) {}

  @Post()
  create(@Body() createTelegramCredentialDto: CreateTelegramCredentialDto) {
    return this.telegramCredentialsService.create(createTelegramCredentialDto);
  }

  @Get()
  findAll() {
    return this.telegramCredentialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telegramCredentialsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTelegramCredentialDto: UpdateTelegramCredentialDto,
  ) {
    return this.telegramCredentialsService.update(
      +id,
      updateTelegramCredentialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.telegramCredentialsService.remove(+id);
  }
}
