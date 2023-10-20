import { Injectable } from '@nestjs/common';
import { CreateTelegramCredentialDto } from './dto/create-telegram-credential.dto';
import { UpdateTelegramCredentialDto } from './dto/update-telegram-credential.dto';

@Injectable()
export class TelegramCredentialsService {
  create(createTelegramCredentialDto: CreateTelegramCredentialDto) {
    return 'This action adds a new telegramCredential';
  }

  findAll() {
    return `This action returns all telegramCredentials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} telegramCredential`;
  }

  update(id: number, updateTelegramCredentialDto: UpdateTelegramCredentialDto) {
    return `This action updates a #${id} telegramCredential`;
  }

  remove(id: number) {
    return `This action removes a #${id} telegramCredential`;
  }
}
