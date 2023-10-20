import { PartialType } from '@nestjs/mapped-types';
import { CreateTelegramCredentialDto } from './create-telegram-credential.dto';

export class UpdateTelegramCredentialDto extends PartialType(CreateTelegramCredentialDto) {}
